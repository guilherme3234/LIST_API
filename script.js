// Aguarda o carregamento do conteúdo HTML antes de executar o script
document.addEventListener('DOMContentLoaded', function () {
    // Seleciona a tabela onde os dados serão exibidos
    const tabela = document.querySelector(".tabela-js");

    // Faz uma requisição GET para obter dados da API
    axios.get(`http://127.0.0.1:5000/list`)
        .then(function (resposta) {
            // Chama a função para processar e exibir os dados recebidos
            getData(resposta.data);
        })
        .catch(function (error) {
            // Exibe um erro no console se a requisição falhar
            console.error(error);
        });

    // Função para processar e exibir os dados na tabela
    function getData(dados) {
        // Atualiza o conteúdo da tabela com os novos dados
        tabela.innerHTML = dados.map(item => `
        <tr>
        <th scope="row">${item.ID}</th>
        <td>${item.TAREFA}</td>
        <td>
            <!-- Botões para excluir e editar cada tarefa -->
            <button class="btn bg-white delete-btn" type="button" data-bs-toggle="modal" data-bs-target="#modalDel">
                <span class="material-symbols-outlined text-danger">delete</span>
            </button>
            <button class="btn bg-white edit-btn" id="edit-tarefa-btn" type="button" data-bs-toggle="modal" data-bs-target="#modalEdit">
                <span class="material-symbols-outlined text-success">edit</span>
            </button>
        </td>
    </tr>`
        ).join('');

        // Chama a função para configurar os eventos dos botões
        todos_Eventos();
    };

    // Função para configurar eventos dos botões
    function todos_Eventos() {
        // Adiciona uma nova tarefa
        document.querySelector("#add-tarefa").addEventListener("click", function () {
            const tarefa = document.querySelector("#tarefa").value;
            if (tarefa === "") {
                alert("Digite uma tarefa!");
                return;
            }

            // Faz uma requisição POST para adicionar uma nova tarefa
            axios.post(`http://127.0.0.1:5000/add`, { Tarefa: tarefa })
                .then(function () {
                    // Recarrega a lista de tarefas após a adição
                    loadTasks();
                })
                .catch(function (error) {
                    // Exibe um erro no console se a requisição falhar
                    console.error(error);
                });
        });

        // Exclui uma tarefa
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", function (e) {
                const id = e.target.closest("tr").querySelector("th").textContent;
                // Faz uma requisição DELETE para excluir a tarefa com o ID especificado
                axios.delete(`http://127.0.0.1:5000/delete`, { data: { id: parseInt(id) } })
                    .then(function () {
                        // Recarrega a lista de tarefas após a exclusão
                        loadTasks();
                    })
                    .catch(function (error) {
                        // Exibe um erro no console se a requisição falhar
                        console.error(error);
                    });
            });
        });

        // Atualiza uma tarefa
        function updateTarefa(id, novaTarefa) {
            // Faz uma requisição PUT para atualizar a descrição da tarefa
            axios.put(`http://127.0.0.1:5000/update/${id}`, { TAREFA: novaTarefa })
                .then(function () {
                    // Recarrega a lista após a atualização
                    loadTasks();
                })
                .catch(function (error) {
                    // Exibe um erro no console se a requisição falhar
                    console.error(error);
                });
        }

        // Edita uma tarefa
        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", function (e) {
                const id = e.target.closest("tr").querySelector("th").textContent;
                const novaTarefa = prompt("Digite a nova descrição da tarefa:");

                // Se o usuário inserir uma nova descrição, atualiza a tarefa
                if (novaTarefa !== null) {
                    updateTarefa(parseInt(id), novaTarefa);
                }
            });
        });
    }

    // Função para recarregar a lista de tarefas na página
    function loadTasks() {
        // Faz uma requisição GET para obter os dados atualizados da API
        axios.get(`http://127.0.0.1:5000/list`)
            .then(function (resposta) {
                // Chama a função para processar e exibir os dados atualizados
                getData(resposta.data);
            })
            .catch(function (error) {
                // Exibe um erro no console se a requisição falhar
                console.error(error);
            });
    }
});
