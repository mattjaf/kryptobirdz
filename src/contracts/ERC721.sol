// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC165.sol";
import "./interfaces/IERC721.sol";

/*
bilding out the minting functions:
    a. nft to point to an address
    b. keep track of the token ids
    c. keep track of token owner addresses to token ids
    d. keep track of how many tokens an owner address has
    e. create an event that emits atransfer log - contract address,
     where it is being minted to, the id
*/

contract ERC721 is ERC165, IERC721 {
    /* event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed id
    );

    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );
    */
    // mappin in solidity creates a hash table of key pair values
    // Mapping from token id to the owner
    mapping(uint256 => address) private _tokenOwner;
    // Mapping from owner to number of owned tokens
    mapping(address => uint256) private _OwnedTokensCount;
    // Mapping from token id to approved addresses
    mapping(uint256 => address) private _tokenApprovals;

    constructor() {
        _registerInterface(
            bytes4(
                keccak256("balanceOf(bytes4)") ^
                    keccak256("ownerOf(bytes4)") ^
                    keccak256("transferFrom(bytes4)")
            )
        );
    }

    function balanceOf(address _owner) public view override returns (uint256) {
        require(_owner != address(0), "owner query for non-existent token");
        return _OwnedTokensCount[_owner];
    }

    function ownerOf(uint256 _tokenId) public view override returns (address) {
        address owner = _tokenOwner[_tokenId];
        require(owner != address(0), "owner query for non-existent token");
        return owner;
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        // setting the address of nft owener to check the mapping
        // of the address from tokenOwner at the token address
        address owner = _tokenOwner[tokenId];
        // return truthiness that addess is not zero
        return owner != address(0);
    }

    function _mint(address to, uint256 tokenId) internal virtual {
        // requires that the address isn't zero
        require(to != address(0), "ERC721: minting to the 0 address");
        // requires that the token does not already exist
        require(!_exists(tokenId), "ERC721: token already minted");
        // we are adding a new address with a token id for minting
        _tokenOwner[tokenId] = to;
        // keeping track of eah address that is minting and adding 1
        _OwnedTokensCount[to] += 1;

        emit Transfer(address(0), to, tokenId);
    }

    function _transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        require(
            _to != address(0),
            "Error - ERC721 Transfer to the zero address"
        );
        require(
            ownerOf(_tokenId) == _from,
            "Trying to to transfer a token the address does not own"
        );
        _OwnedTokensCount[_from] -= 1;
        _OwnedTokensCount[_to] += 1;
        _tokenOwner[_tokenId] = _to;
        emit Transfer(address(_from), _to, _tokenId);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public override {
        require(isApprovedOrOwner(msg.sender, _tokenId)); //
        _transferFrom(_from, _to, _tokenId);
    }

    // that the person approving is the owner
    function approve(address _to, uint256 tokenId) public {
        // require that the person approving is the owner
        address owner = ownerOf(tokenId);
        require(_to != owner, "Error - approval to current owner");
        require(msg.sender == owner, "Current caller is not the owner");
        _tokenApprovals[tokenId] = _to;
        emit Approval(owner, _to, tokenId);
    }

    function isApprovedOrOwner(address spender, uint256 tokenId)
        internal
        view
        returns (bool)
    {
        require(_exists(tokenId), "token does not exist");
        address owner = ownerOf(tokenId);
        return (spender == owner); // || getApproved(tokenId == spender));
    }
}
