pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.6/vendor/Ownable.sol";

contract MarineInsurance is ChainlinkClient, Ownable{

    enum RequestStatus {
        CREATED,
        INITIATED,
        COMPLETED
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
        int256 currentWaterLevel;
        bytes32 currentRequestId;
        RequestStatus requestStatus;
    }

    struct InsurancePolicy{
        ShipData shipData;
        CoverageData coverageData;
        TrackingData trackingData;
    }

    event InsurancePolicyCreation (
        address indexed beneficiary,
        uint256 indexed insuranceIdentifier
    );

    event ClaimPayout (
        address indexed beneficiary,
        uint256 indexed insuranceIdentifier,
        uint256 amountPaid
    );

    InsurancePolicy[] insurancePolicies;
    mapping(address => uint[]) insurancePolicyOwnership;
    mapping(bytes32 => uint) requestToInsurancePolicyId;

    address oracle;
    bytes32 jobId;
    uint256 fee;

    constructor(address _linkTokenAddress, address _oracleAddress, bytes32 _jobId, uint256 _fee) public {
        oracle = _oracleAddress;
        jobId = _jobId;
        fee = _fee;
        if (_linkTokenAddress == address(0)) {
            setPublicChainlinkToken();
        } else {
            setChainlinkToken(_linkTokenAddress);
        }
    }

    //Calculate premium
    function calculatePremium(ShipData memory _shipData) public view returns (uint256){
        //TODO: Implement premium calculation formula
        return 100;
    }

    function calculateDailyClaimPayouts(ShipData memory _shipData) public view returns(uint256) {
        //TODO: Implement payout calculation forumula
        return 100;
    }


    //Create an insurance policy record
    function registerInsurancePolicy(ShipData memory _shipData,
        Coordinate memory _location,
        uint256 _startDate,
        uint256 _endDate)
    public payable returns(uint256) {
        uint256 premium = calculatePremium(_shipData);
        //TODO: Add validation for _shipData
        require(premium == msg.value, "You need to pay the policy premium");
        uint256 claimPaymentAmount = calculateDailyClaimPayouts(_shipData);

        TrackingData memory initialTrackingData = TrackingData({
            location: _location,
            currentWaterLevel: -9999,
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
            beneficiary: msg.sender
        });

        InsurancePolicy memory policy = InsurancePolicy({
            coverageData: coverageData,
            shipData: _shipData,
            trackingData: initialTrackingData
        });

        insurancePolicies.push(policy);
        uint256 identifier = insurancePolicies.length - 1;
        insurancePolicyOwnership[msg.sender].push(identifier);
        emit InsurancePolicyCreation(msg.sender, identifier);
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
        insurancePolicy.trackingData.currentWaterLevel = _level;
        insurancePolicy.trackingData.requestStatus = RequestStatus.COMPLETED;
        delete requestToInsurancePolicyId[_requestId];
        if (_level > insurancePolicy.coverageData.waterLevelMin &&
            _level < insurancePolicy.coverageData.waterLevelMax) {
            return;
        }
        //Create and pay claim
        else {
            uint amountToPayToday = insurancePolicy.coverageData.dailyClaimAmount;
            insurancePolicy.coverageData.beneficiary.transfer(amountToPayToday);
            emit ClaimPayout(insurancePolicy.coverageData.beneficiary,
                requestToInsurancePolicyId[_requestId],
                amountToPayToday);
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

    function setOracleData(address _oracleAddress, bytes32 _jobId, uint256 _fee) public onlyOwner{
        oracle = _oracleAddress;
        jobId = _jobId;
        fee = _fee;
    }

    function getOracleAddress() public view onlyOwner returns (address){
        return oracle;
    }


}
