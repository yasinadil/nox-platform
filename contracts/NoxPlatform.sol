// SPDX-License-Identifier: MIT

import "./NoxSBT.sol";

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}
pragma solidity ^0.8.17;

contract NoxPlatform is Ownable, ReentrancyGuard {
    NOXSBT public NFTInterface;
    IERC20 private NoxInterface;
    address public noxTokenAddress = 0x385A96b35bdbC919D0Bd95670461CB2153813C71;
    uint256 public PUBLIC_SALE_PRICE = 0 ether;
    uint256 public docCount = 0;
    uint256 public academicPrice = 25000 ether;
    uint256 public institutionalPrice = 100000 ether;
    uint256 public freeAmount = 20;
    uint256 public academicAmount = 10000;

    struct Document {
        uint256 id;
        string details;
        string url;
        address issuer;
        address issuee;
        bool hidden;
    }

    mapping(uint256 => Document) public Documents;
    mapping(address => uint256) public documentsIssued;
    mapping(address => uint256) public nftLimit;
    mapping(address => uint256) public subscription;
    mapping (uint256 => mapping (address => string)) public encryptedUrls;

    event nftIssued(
        uint256 id,
        string details,
        string url,
        address issuer,
        address owner
    );

    constructor(address _nftAddress) {
        NFTInterface = NOXSBT(_nftAddress);
        NoxInterface = IERC20(noxTokenAddress);
    }

    function issue(
        address _to,
        string memory _details,
        string memory _url,
        bool _isPrivate
    ) external payable {
        if (PUBLIC_SALE_PRICE > 0) {
            require(
                NoxInterface.transferFrom(
                    msg.sender,
                    address(this),
                    PUBLIC_SALE_PRICE
                ),
                "Not enough Nox Tokens sent!"
            );
        }

        if (subscription[msg.sender] == 0) {
            require(
                documentsIssued[msg.sender] <= freeAmount,
                "Free tier expired"
            );
        } else {
            require(
                nftLimit[msg.sender] > 0,
                "You have used your allowed limit"
            );
            nftLimit[msg.sender]--;
        }
        Documents[docCount] = Document(
            docCount,
            _details,
            _url,
            msg.sender,
            _to,
            _isPrivate
        );
        emit nftIssued(docCount, _details, _url, msg.sender, _to);
        docCount++;
        documentsIssued[msg.sender]++;
        NFTInterface.mint(_to, _url);
    }

    function giveAccess(uint256 _tokenId, address _to, string memory _encryptedHash) external {
        require(NFTInterface.ownerOf(_tokenId) == msg.sender, "Unauthorized!");
        encryptedUrls[_tokenId][_to] = _encryptedHash;
    }

    function revokeAccess(uint256 _tokenId, address _to) external {
        require(NFTInterface.ownerOf(_tokenId) == msg.sender, "Unauthorized!");
        delete encryptedUrls[_tokenId][_to];
    }

    function buyPackage(uint256 _id) external payable {
        require(_id >= 1 && _id <= 2, "Invalid Id");
        if (_id == 1) {
            require(
                NoxInterface.transferFrom(
                    msg.sender,
                    address(this),
                    academicPrice
                ),
                "Insufficient amount provided."
            );
            nftLimit[msg.sender] = academicAmount;
            subscription[msg.sender] = 1;
        } else if (_id == 2) {
            require(
                NoxInterface.transferFrom(
                    msg.sender,
                    address(this),
                    institutionalPrice
                ),
                "Insufficient amount provided."
            );
            nftLimit[msg.sender] = 2**256 - 1;
            subscription[msg.sender] = 2;
        }
    }

    function setSalePrice(uint256 _price) external onlyOwner {
        PUBLIC_SALE_PRICE = _price;
    }

    function getNFTs() public view returns (Document[] memory) {
        Document[] memory _documents = new Document[](docCount);
        for (uint256 i = 0; i < docCount; i++) {
            _documents[i] = Documents[i];
        }
        return _documents;
    }

    function setAcademicPrice(uint256 _value) external onlyOwner {
        academicPrice = _value;
    }

    function setInstitutionalPrice(uint256 _value) external onlyOwner {
        institutionalPrice = _value;
    }

    function setFreeAmount(uint256 _value) external onlyOwner {
        freeAmount = _value;
    }

    function setAcademicAmount(uint256 _value) external onlyOwner {
        academicAmount = _value;
    }
}