pragma solidity ^0.5;

contract Election {
    struct Candidate {
        uint256 id;
        string name;
        string party;
        uint256 voteCount;
    }

    event votedEvent(uint256 indexed _candidateId);

    mapping(uint256 => Candidate) public candidates;
    mapping(string => bool) candidateNames;
    mapping(address => bool) public voters;
    uint256 public candidatesCount;

    function addCandidate(string memory _name, string memory _party) private {
        require(
            !candidateNames[_name],
            "Candidate with this name already exists"
        );
        candidatesCount++;
        candidates[candidatesCount] = Candidate(
            candidatesCount,
            _name,
            _party,
            0
        );
        candidateNames[_name] = true;
    }

    function vote(uint256 _candidateId) public {
        require(!voters[msg.sender]);
        require(_candidateId > 0 && _candidateId < candidatesCount);
        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        emit votedEvent(_candidateId);
    }

    constructor() public {
        addCandidate("Valdas Kazlauskas", "Darnios Lietuvos partija");
        addCandidate("Paulius Zaranka", "Šiaulių Partija");
        addCandidate("Paulius Mykolaitis", "Alytaus partija");
    }
}
