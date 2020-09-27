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
    address public waterLevelOracle;
    bytes32 public waterLevelJobId;
    uint256 public waterLevelFee;

    //Water level evaluation period oracle data
    address public waterLevelEvaluationPeriodOracle;
    bytes32 public waterLevelEvaluationPeriodJobId;
    uint256 public waterLevelEvaluationPeriodFee;
    uint256 public waterLevelEvaluationPeriod;
    bool public waterLevelEvaluationPeriodActive;

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

    /*----------  PUBLIC FUNCTIONS  ----------*/
    //Calculate premium
    function calculatePremium(ShipData memory _shipData) public view returns (uint256){
        //TODO: Implement premium calculation formula
        return 100;
    }

    function calculateDailyClaimPayouts(ShipData memory _shipData) public pure returns(uint256) {
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

    function getInsurancePolicies() public view returns (InsurancePolicy[] memory){
        return getInsurancePolicies(msg.sender);
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

    /*----------  ORACLE ONLY FUNCTIONS  ----------*/

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
        if(!isPolicyActive(insurancePolicy)) {
            emit InsurancePolicyExpired(insurancePolicy.coverageData.beneficiary,
                requestToInsurancePolicyId[_requestId], now);
        }
        if(waterLevelEvaluationPeriodActive) {
            startWaterLevelEvaluationRequestPeriod();
        }
    }

    function automatedWaterEvaluationLevelReceiver(bytes32 _requestId) public recordChainlinkFulfillment(_requestId) {
        requestWaterLevels();
    }

    /*----------  ADMINISTRATOR ONLY FUNCTIONS  ----------*/

    //Create request to get water levels of coordinate
    function requestWaterLevelsManually() public onlyOwner {
        requestWaterLevels();
    }

    function setWaterLevelOracleData(address _oracleAddress, bytes32 _jobId, uint256 _fee) public onlyOwner{
        waterLevelOracle = _oracleAddress;
        waterLevelJobId = _jobId;
        waterLevelFee = _fee;
    }

    function setWaterLevelEvaluationPeriodOracle(address _oracleAddress, bytes32 _jobId, uint256 _fee) public onlyOwner{
        waterLevelEvaluationPeriodOracle = _oracleAddress;
        waterLevelEvaluationPeriodJobId = _jobId;
        waterLevelEvaluationPeriodFee = _fee;
    }

    function setWaterLevelEvaluationRequestPeriod(uint256 _seconds) public onlyOwner {
        waterLevelEvaluationPeriod = _seconds;
    }

    function setWaterLevelEvaluationPeriodActive(bool _isActive) public onlyOwner {
        waterLevelEvaluationPeriodActive = _isActive;
    }

    function startWaterLevelEvaluationRequestPeriod() public onlyOwner {
        waterLevelEvaluationPeriodActive = true;
        Chainlink.Request memory req = buildChainlinkRequest(waterLevelEvaluationPeriodJobId, address(this),
            this.automatedWaterEvaluationLevelReceiver.selector);
        req.addUint("until", now + waterLevelEvaluationPeriod);
        sendChainlinkRequestTo(waterLevelEvaluationPeriodOracle, req, waterLevelEvaluationPeriodFee);
    }

    /*----------  PRIVATE FUNCTIONS  ----------*/

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

    /*----------  FALLBACK FUNCTION  ----------*/
    //@notice this will enable anyone to send eth to the smart contract
    fallback() external payable {
    }
}
