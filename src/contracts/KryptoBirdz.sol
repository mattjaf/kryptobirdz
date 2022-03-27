// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721Connector.sol";

contract KryptoBird is ERC721Connector {
    // array to store out nfts
    string[] public kryptoBirdz;

    mapping(string => bool) _kryptoBirdzExists;

    function mint(string memory _kryptoBird) public {
        require(
            !_kryptoBirdzExists[_kryptoBird],
            "Error - kryptoBird already exist"
        );
        // this is deprecated uint _id = KryptoBirdz.push(_kryptoBird);
        kryptoBirdz.push(_kryptoBird);
        uint256 _id = kryptoBirdz.length - 1;

        //.push no longer retruns legnth but ref the added element

        _mint(msg.sender, _id);

        _kryptoBirdzExists[_kryptoBird] = true;
    }

    constructor() ERC721Connector("KryptoBird", "KBIRDZ") {}
}
