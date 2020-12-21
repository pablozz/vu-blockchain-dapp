pragma solidity ^0.5;

contract Social {
    string public name = "Social";

    uint256 public imageCount = 0;
    mapping(uint256 => Image) public images;

    struct Image {
        uint256 id;
        string hash;
        string desc;
        uint256 Likes;
        address payable author;
    }
    event ImageCreated(
        uint256 id,
        string hash,
        string desc,
        uint256 Likes,
        address payable author
    );
    event ImageLiked(
        uint256 id,
        string hash,
        string desc,
        uint256 Likes,
        address payable author
    );

    function uploadImage(string memory _imgHash, string memory _desc) public {
        require(bytes(_imgHash).length > 0); //egzzistuoja nuotraukos hash
        require(bytes(_desc).length > 0); //kad aprasymas nebutu blank
        require(msg.sender != address(0x0)); //kad egzistuoja nuotraukos ikelejas
        imageCount++; //kiekviena karta kai ikeliama nuotrauka, padidinamas nuotraukos id, kad nebutu dublikatu
        images[imageCount] = Image(imageCount, _imgHash, _desc, 0, msg.sender); //pridedama nuotrauka i kontrakta
        emit ImageCreated(imageCount, _imgHash, _desc, 0, msg.sender); //emitinamas eventas
    }

    function likeImage(uint256 _id) public payable {
        require(_id > 0 && _id <= imageCount);
        Image memory _image = images[_id];
        address payable _author = _image.author;
        address(_author).transfer(msg.value);
        _image.Likes = _image.Likes + msg.value;
        images[_id] = _image;
        emit ImageLiked(_id, _image.hash, _image.desc, _image.Likes, _author);
    }
}
