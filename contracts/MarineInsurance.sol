pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.6/vendor/Ownable.sol";

contract MarineInsurance is ChainlinkClient, Ownable{

    enum RequestStatus {
        CREATED, // @dev The user created the policy and the water level hasn't been measured.
        INITIATED, // @dev The smart contract has requested the water level for the policy. Water levels are measured every 24 hours.
        COMPLETED //@dev The smart contract has received the water level value.
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

    event InsurancePolicyExpired (
        address indexed beneficiary,
        uint256 indexed insuranceIdentifier,
        uint256 dateExpired
    );

    InsurancePolicy[] public insurancePolicies;
    mapping(address => uint[]) insurancePolicyOwnership;
    mapping(bytes32 => uint) requestToInsurancePolicyId;

    //Water level oracle data
    address waterLevelOracle;
    bytes32 waterLevelJobId;
    uint256 waterLevelFee;

    //Water level evaluation period oracle data
    address waterLevelEvaluationPeriodOracle;
    bytes32 waterLevelEvaluationPeriodJobId;
    uint256 waterLevelEvaluationPeriodFee;

    constructor(address _linkTokenAddress, address _oracleAddress, bytes32 _jobId, uint256 _fee) public {
        waterLevelOracle = _oracleAddress;
        waterLevelJobId = _jobId;
        waterLevelFee = _fee;
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
            waterLevelMin: -50,
            waterLevelMax: 50,
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



    function isPolicyActive(uint256 _identifier) public view returns(bool){
        InsurancePolicy storage policy = insurancePolicies[_identifier];
        return now >= policy.coverageData.startDate && now <= policy.coverageData.endDate;
    }

    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    //oracle only functions
    //Receive request of water level
    //@dev recordChainlinkFulfillment modifier prevents this function to be called by anything else other than the oracle.
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
        if(!isPolicyActive(insurancePolicy)){
            emit InsurancePolicyExpired(insurancePolicy.coverageData.beneficiary,
                requestToInsurancePolicyId[_requestId], now);
        }
    }

    function automatedWaterEvaluationLevelReceiver(bytes32 _requestId) public recordChainlinkFulfillment(_requestId) {
        requestWaterLevels();
    }

    //onlyOwner functions

    //Create request to get water levels of coordinate
    function requestWaterLevelsManually() public onlyOwner {
        requestWaterLevels();
    }

    function setWaterLevelOracleData(address _oracleAddress, bytes32 _jobId, uint256 _fee) public onlyOwner{
        waterLevelOracle = _oracleAddress;
        waterLevelJobId = _jobId;
        waterLevelFee = _fee;
    }

    function getWaterLevelOracleAddress() public view onlyOwner returns (address){
        return waterLevelOracle;
    }

    function setWaterLevelEvaluationPeriodOracle(address _oracleAddress, bytes32 _jobId, uint256 _fee) public onlyOwner{
        waterLevelEvaluationPeriodOracle = _oracleAddress;
        waterLevelEvaluationPeriodJobId = _jobId;
        waterLevelEvaluationPeriodFee = _fee;
    }

    function getWaterLevelEvaluationPeriodOracleAddress() public view onlyOwner returns (address) {
        return waterLevelOracle;
    }

    function startWaterLevelEvaluationRequestPeriod(uint256 _seconds) public onlyOwner {
        Chainlink.Request memory req = buildChainlinkRequest(waterLevelEvaluationPeriodJobId, address(this),
            this.automatedWaterEvaluationLevelReceiver.selector);
        req.addUint("until", now + _seconds);
        sendChainlinkRequestTo(waterLevelEvaluationPeriodOracle, req, waterLevelEvaluationPeriodFee);
    }

    //private functions

    function requestWaterLevels() private {
        for(uint i = 0; i < insurancePolicies.length; i++) {
            InsurancePolicy storage insurancePolicy = insurancePolicies[i];
            if(isPolicyActive(insurancePolicy)){
                insurancePolicy.trackingData.requestStatus = RequestStatus.INITIATED;
                Chainlink.Request memory request = buildChainlinkRequest(waterLevelJobId, address(this), this.receiveWaterLevel.selector);
                request.add("lat", insurancePolicy.trackingData.location.lat);
                request.add("lng", insurancePolicy.trackingData.location.lng);
                bytes32 requestId = sendChainlinkRequestTo(waterLevelOracle, request, waterLevelFee);
                requestToInsurancePolicyId[requestId] = i;
            }
        }
    }

    function isPolicyActive(InsurancePolicy memory _policy) private view returns(bool){
        return now >= _policy.coverageData.startDate
        && now <= _policy.coverageData.endDate;
    }
}
