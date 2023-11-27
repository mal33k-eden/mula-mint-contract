// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {MintTool} from "./MintTool.sol";


contract MulaMint is ERC20, MintTool {
    uint256 tokenSupply = 20 * 10 ** 6 * (10 ** uint256(decimals()));
    constructor()
    ERC20("MulaMint", "MULMINT")
    MintTool(){
        _mint(msg.sender, tokenSupply);
    }
}
