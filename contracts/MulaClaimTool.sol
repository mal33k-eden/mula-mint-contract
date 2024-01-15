// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {MulaMint} from "./MulaMint.sol";

contract MulaClaimTool is ReentrancyGuard {

    struct Records {uint256 bnbInvested;uint256 usdtInvested; uint256 claimedAmount;bool status;}

    mapping(address => Records) private _claims;

    event ClaimedMulaMint(address indexed _investor, uint256 _claimed);

    MulaMint private  _tokenContract;

    constructor (MulaMint token) ReentrancyGuard()  {
        _tokenContract = token; //link to token contract et
    }

    modifier OnlySingleClaims {
        require(!_claims[msg.sender].status, "You have already claimed your MulaMint. Speak to admin if you have any concerns.");
        _;
    }
    function claim(uint256 _bnbInvested, uint256 _usdtInvested, uint256 _amount) external payable OnlySingleClaims nonReentrant() returns (bool){

        bool sent = _tokenContract.transfer(msg.sender, _amount);

        require(sent, "Unable to complete claim transfer. Try again");
        _claims[msg.sender] = Records(_bnbInvested, _usdtInvested, _amount, true);
        emit ClaimedMulaMint(msg.sender, _amount);
        return true;
    }

    function getClaimRecord(address _investor) public view returns (address investor, uint256 bnbInvested, uint256 usdtInvested, uint256 claimedAmount){
        Records memory record = _claims[_investor];
        require(record.status, "There is no record for this investor.  Check address and try again.");
        return (_investor, record.bnbInvested, record.usdtInvested, record.claimedAmount);
    }

}
