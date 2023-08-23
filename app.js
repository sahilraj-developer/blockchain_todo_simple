document.addEventListener('DOMContentLoaded', () => {
    if (typeof web3 !== 'undefined') {
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.error('Web3 not found. Please install MetaMask or another web3 provider.');
    }

    // Your contract address and ABI.
    const contractAddress = 'YOUR_CONTRACT_ADDRESS';
      const contractABI = [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_description",
                    "type": "string"
                }
            ],
            "name": "createTask",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        // More ABI entries...
    ];

    

    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const taskForm = document.getElementById('taskForm');
    const taskDescription = document.getElementById('taskDescription');
    const taskList = document.getElementById('taskList');

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const description = taskDescription.value;
        if (description.trim() !== '') {
            contract.methods.createTask(description).send({ from: web3.eth.defaultAccount })
                .on('transactionHash', (hash) => {
                    // Task creation transaction sent.
                })
                .on('receipt', (receipt) => {
                    // Task created successfully.
                    taskDescription.value = '';
                })
                .on('error', (error) => {
                    console.error(error);
                });
        }
    });

    function renderTasks() {
        taskList.innerHTML = '';
        contract.methods.taskCount().call().then((count) => {
            for (let i = 1; i <= count; i++) {
                contract.methods.tasks(i).call().then((task) => {
                    const taskItem = document.createElement('li');
                    taskItem.innerHTML = `
                        <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''} />
                        <label for="task-${task.id}">${task.description}</label>
                    `;
                    taskList.appendChild(taskItem);

                    taskItem.querySelector('input').addEventListener('change', () => {
                        contract.methods.toggleTask(task.id).send({ from: web3.eth.defaultAccount })
                            .on('transactionHash', (hash) => {
                                // Task toggle transaction sent.
                            })
                            .on('receipt', (receipt) => {
                                // Task toggled successfully.
                            })
                            .on('error', (error) => {
                                console.error(error);
                            });
                    });
                });
            }
        });
    }

    renderTasks();
});
