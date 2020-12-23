App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      ethereum.enable();

      // App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');

      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider(
        'http://localhost:7545'
      );
      ethereum.enable();

      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON('Election.json', function (election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  render: function () {
    let electionInstance;
    let loader = $('#loader');
    let content = $('#content');

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $('#accountAddress').html('Your Account: ' + '<b>' + account + '</b>');
      }
    });

    // Load contract data
    App.contracts.Election.deployed()
      .then(function (instance) {
        electionInstance = instance;
        return electionInstance.candidatesCount();
      })
      .then(function (candidatesCount) {
        let candidatesResults = $('#candidatesResults');
        candidatesResults.empty();

        let candidatesSelect = $('#candidatesSelect');
        candidatesSelect.empty();

        for (let i = 1; i <= candidatesCount; i++) {
          electionInstance.candidates(i).then(function (candidate) {
            let id = candidate[0].toNumber();
            let name = candidate[1];
            let party = candidate[2];
            let voteCount = candidate[3].toNumber();

            // Render candidate Result
            let candidateTemplate =
              '<tr><th>' +
              id +
              '</th><td>' +
              name +
              '</td><td>' +
              party +
              '</td><td>' +
              voteCount +
              '</td></tr>';
            candidatesResults.append(candidateTemplate);

            // Render candidate ballot option
            let candidateOption =
              "<option value='" +
              id +
              "' >" +
              name +
              '(' +
              party +
              ')' +
              '</ option>';
            candidatesSelect.append(candidateOption);
          });
        }
        return electionInstance.voters(App.account);
      })
      .then(function (hasVoted) {
        if (hasVoted) {
          $('form').hide();
        }
        loader.hide();
        content.show();
      })
      .catch(function (error) {
        console.warn(error);
      });
  },
  castVote: function () {
    let candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed()
      .then(function (instance) {
        return instance.vote(candidateId, { from: App.account });
      })
      .then(function (result) {
        // Wait for votes to update
        $('#content').hide();
        $('#loader').show();
      })
      .catch(function (err) {
        console.error(err);
      });
  },
  listenForEvents: function () {
    App.contracts.Election.deployed().then(function (instance) {
      instance
        .votedEvent(
          {},
          {
            fromBlock: 'latest',
          }
        )
        .watch(function (error, event) {
          console.log('event triggered', event);
          // Reload when a new vote is recorded
          App.render();
        });
    });
  },
  sortTable: function (n) {
    let table,
      rows,
      switching,
      i,
      x,
      y,
      shouldSwitch,
      dir,
      switchcount = 0;
    table = document.getElementById('myTable');
    switching = true;
    // Set the sorting direction to ascending:
    dir = 'asc';
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
        first, which contains table headers): */
      for (i = 1; i < rows.length - 1; i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
            one from current row and one from the next: */
        x = rows[i].getElementsByTagName('TD')[n];
        y = rows[i + 1].getElementsByTagName('TD')[n];
        /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
        if (dir == 'asc') {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == 'desc') {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount++;
      } else {
        /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == 'asc') {
          dir = 'desc';
          switching = true;
        }
      }
    }
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
