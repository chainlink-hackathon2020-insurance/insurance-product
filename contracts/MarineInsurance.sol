pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/evm-contracts/src/v0.6/ChainlinkClient.sol";
import "https://raw.githubusercontent.com/smartcontractkit/chainlink/develop/evm-contracts/src/v0.6/vendor/Ownable.sol";

contract MarineInsurance is ChainlinkClient, Ownable{

    enum RequestStatus {
        CREATED,
        INITIATED,
        COMPLETED
    }

    struct OracleData {
        bytes32 jobId;
        uint256 fee;
        bool active;
    }

    struct Coordinate {
        string lat;
        string lng;
    }

    struct ShipData{
        uint256 shipmentValue;
    }

    struct CoverageData {
        uint256 dailyClaimAmount;
        uint256 startDate;
        uint256 endDate;
        int256 waterLevelMin;
        int256 waterLevelMax;
        address payable beneficiary;
    }

    struct TrackingData {
        //TODO: Should this be updated? What value should be passed here?
        Coordinate location;
        int256 currentWaterlevel;
        bytes32 currentRequestId;
        RequestStatus requestStatus;
    }

    struct InsurancePolicy{
        ShipData shipData;
        CoverageData coverageData;
        TrackingData trackingData;
    }

    InsurancePolicy[] insurancePolicies;
    mapping(address => uint[]) insurancePolicyOwnership;
    mapping(bytes32 => uint) requestToInsurancePolicyId;
    mapping(address => OracleData) waterLevelOracles;
    uint waterLevelOracleCount = 0;

    //TODO: Use multiple oracles
    address constant oracle = 0x121927a28b6C5a77064012d8dC0Df3Af81d175de;
    bytes32 constant jobId = "818de5fad1514b3cb5f356c8200e265d";
    uint256 constant fee = 0.1 * 10 ** 18; // 0.1 LINK

    constructor(address _link) public {
        if (_link == address(0)) {
            setPublicChainlinkToken();
        } else {
            setChainlinkToken(_link);
        }
    }

    //Calculate premium
    function calculatePremium(ShipData memory _shipData) public view returns (uint256){
        //TODO: Implement premium calculation formula
        return 1;
    }

    function calculateDailyClaimPayouts(ShipData memory _shipData) public view returns(uint256) {
        //TODO: Implement payout calculation forumula
        return 1;
    }


    //Create an insurance policy record
    function registerInsurancePolicy(ShipData memory _shipData,
        Coordinate memory _location,
        uint256 _startDate,
        uint256 _endDate,
        address payable beneficiary)
    public payable returns(uint256) {
        uint256 premium = calculatePremium(_shipData);
        //TODO: Add validation for _shipData
        require(premium == msg.value, "You need to pay the policy premium");
        require(beneficiary != address(0), "Beneficiary should not be burning address");
        uint256 claimPaymentAmount = calculateDailyClaimPayouts(_shipData);

        TrackingData memory initialTrackingData = TrackingData({
        location: _location,
        currentWaterlevel: -9999,
        currentRequestId: "0x0",
        requestStatus : RequestStatus.CREATED
        });

        CoverageData memory coverageData = CoverageData({
        startDate: _startDate,
        endDate: _endDate,
        dailyClaimAmount: claimPaymentAmount,
        //TODO: Are these constant?
        waterLevelMin: 0,
        waterLevelMax: 200,
        beneficiary: beneficiary
        });

        InsurancePolicy memory policy = InsurancePolicy({
        coverageData: coverageData,
        shipData: _shipData,
        trackingData: initialTrackingData
        });

        insurancePolicies.push(policy);
        uint256 identifier = insurancePolicies.length - 1;
        insurancePolicyOwnership[msg.sender].push(identifier);
        //TODO: Emit event that policy has been registered
        return identifier;
    }

    function getInsurancePolicies(address owner) public view returns (InsurancePolicy[] memory){
        uint[] storage insurancePolicyIds = insurancePolicyOwnership[owner];
        InsurancePolicy[] memory result = new InsurancePolicy[](insurancePolicyIds.length);
        for(uint i = 0; i < insurancePolicyIds.length; i++) {
            result[i] = insurancePolicies[insurancePolicyIds[i]];
        }
        return result;
    }

    //Receive request of water level
    function receiveWaterLevel(bytes32 _requestId, int256 _level) public recordChainlinkFulfillment(_requestId){
        InsurancePolicy storage insurancePolicy = insurancePolicies[requestToInsurancePolicyId[_requestId]];
        insurancePolicy.trackingData.currentWaterlevel = _level;
        insurancePolicy.trackingData.requestStatus = RequestStatus.COMPLETED;
        delete requestToInsurancePolicyId[_requestId];
        if(isPolicyActive(insurancePolicy)){
            if(_level > insurancePolicy.coverageData.waterLevelMin &&
                _level < insurancePolicy.coverageData.waterLevelMax){
                return;
            }
            //Create and pay claim
            else {
                uint amountToPayToday = insurancePolicy.coverageData.dailyClaimAmount;
                insurancePolicy.coverageData.beneficiary.transfer(amountToPayToday);
                //TODO: Emit event for frontend
            }
        }
    }

    function isPolicyActive(InsurancePolicy memory _policy) private view returns(bool){
        return now >= _policy.coverageData.startDate
        && now <= _policy.coverageData.endDate;
    }

    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    //onlyOwner functions

    //Create request to get water levels of coordinate
    function requestWaterLevels() public onlyOwner{
        //TODO: Use multiple oracles

        for(uint i = 0; i < insurancePolicies.length; i++) {
            InsurancePolicy storage insurancePolicy = insurancePolicies[i];
            if(isPolicyActive(insurancePolicy)){
                insurancePolicy.trackingData.requestStatus = RequestStatus.INITIATED;
                Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.receiveWaterLevel.selector);
                request.add("lat", insurancePolicy.trackingData.location.lat);
                request.add("lng", insurancePolicy.trackingData.location.lng);
                bytes32 requestId = sendChainlinkRequestTo(oracle, request, fee);
                requestToInsurancePolicyId[requestId] = i;
            }
        }
    }

    function addOracle(address _oracle, bytes32 _jobId, uint256 _fee) public onlyOwner{
        OracleData memory oracleData = OracleData(_jobId, _fee, true);
        waterLevelOracles[_oracle] = oracleData;
    }

    function removeOracle(address _oracle) public onlyOwner{
        delete waterLevelOracles[_oracle];
    }


}
