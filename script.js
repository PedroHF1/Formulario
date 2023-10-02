const form = document.querySelector('#form');
        const nome = document.querySelector('#nome');
        const sobrenome = document.querySelector('#sobrenome');
        const email = document.querySelector('#email');
        const website = document.querySelector('#website');

        let dataInicialStr = document.querySelector('#dataini');
        let dataFimStr = document.querySelector('#datafim');
        let dataAtual = new Date();

        const regiao = document.querySelectorAll('input[type=radio]');

        const atividades = document.querySelectorAll('input[type=checkbox]');

        montarTabela();

        form.addEventListener('submit', validarForm);
        function validarForm(event) {

            event.preventDefault();


            if (nome.value === '' || nome.value.length < 3) {
                document.querySelector('#error').textContent = 'nome invalido!';
            }
            else {
                document.querySelector('#error').textContent = '';
            }
            if (sobrenome.value === '') {
                document.querySelector('#error2').textContent = 'sobrenome invalido!';

            } else {
                document.querySelector('#error2').textContent = '';
            }
            if (email.value === '' || !validarEmail(email.value)) {
                document.querySelector('#error3').textContent = 'email invalido!';

            } else {
                document.querySelector('#error3').textContent = '';
            }

            // FUNÇÃO DE E-MAIL

            function validarEmail(email) {

                if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
                    return false;
                }
                if (email.indexOf("@") === 0 || email.indexOf("@") === email.length - 1) {
                    return false;
                }
                if (email.indexOf("@@") !== -1) {
                    return false;
                }
                if (email.indexOf("..") !== -1) {
                    return false;
                }
                if (email.charAt(0) === "." || email.charAt(email.length - 1) === ".") {
                    return false;
                }

                return true;
            }

            // CAMPO WEBSITE

            if (website.value === '') {
                document.querySelector('#error4').textContent = '';
            }

            if (website.value !== '') {
                if (validarURL(website.value)) {
                    document.querySelector('#error4').textContent = '';
                } else {
                    document.querySelector('#error4').textContent = 'url invalida';
                }
            }

            function validarURL(website) {
                var a = document.createElement('a');
                a.href = website;

                if (!a.protocol || !a.hostname) {
                    return false;
                }
                if (a.protocol != "http:" && a.protocol != "https:") {
                    return false;
                }
                return true;
            }

            // DATA INICIAL

            if (dataInicialStr.value === '') {
                document.querySelector('#error5').textContent = 'data inicial invalida!';
            } else {
                document.querySelector('#error5').textContent = '';
            }

            if (dataInicialStr.value !== '') {
                validarDataIni();
            }

            function validarDataIni() {
                let dataInicialStr = new Date(document.querySelector('#dataini').value);
                dataAtual.setHours(0, 0, 0, 0);
                dataInicialStr.setHours(0, 0, 0, 0);

                if (dataInicialStr < dataAtual) {
                    document.querySelector('#error5').textContent = 'data inicial invalida!';
                    return false;
                }
                if (dataInicialStr == dataAtual) {
                    return true;
                }
                return true;
            }

            // DATA FINAL

            if (dataFimStr.value === '') {
                document.querySelector('#error6').textContent = 'data final invalida!';
            } else {
                document.querySelector('#error6').textContent = '';
            }

            if (dataFimStr.value !== '') {
                validarDataFim();
            }

            function validarDataFim() {
                var dataInicio = new Date(document.querySelector("#dataini").value);
                var dataFinal = new Date(document.querySelector("#datafim").value);

                if (dataFinal <= dataInicio) {
                    document.querySelector('#error6').textContent = 'data final invalida!';
                    return false;
                }
                return true;
            }

            // PARTE DE REGIÕES 

            let selecionado = false;

            for (let i = 0; i < regiao.length; i++) {
                if (regiao[i].checked) {
                    selecionado = true;
                    break;
                }
            }
            if (!selecionado) {
                document.querySelector('#error7').textContent = 'regiao invalida!';
            } else {
                document.querySelector('#error7').textContent = '';
            }

            // PARTE DE ATIVIDADES

            let selecionados = 0;

            for (let i = 0; i < atividades.length; i++) {
                if (atividades[i].checked) {
                    selecionados++;
                }
            }

            if (selecionados === 0) {
                document.querySelector('#error8').textContent = 'atividade invalida!';
                return false;
            }

            if (selecionados > 3) {
                document.querySelector('#error8').textContent = 'selecione apenas 3 atividades';
                return false;
            }

            if (nome.value === '' && sobrenome.value === '' && email.value === '' && dataInicialStr.value === '' && dataFimStr.value === '') {
                return false;
            } else {
                form.submit();
            }

            // CRIAR OBJETO JSON
            const prestadorServico = {
                nome: nome.value,
                sobrenome: sobrenome.value,
                email: email.value,
                site: website.value,
                dataini: dataInicialStr.value,
                datafim: dataFimStr.value,
                regiao: document.querySelector('input[name=regiao]:checked').value,
                atividade: Array.from(document.querySelectorAll('input[name=atividade]:checked')).map(a => a.value)
            }
            console.log(prestadorServico);

            // OBTEM ARRAY DE PRESTADOR DE SERVICO DO LOCALSTORAGE
            const prestadoresDeServico = JSON
                .parse(localStorage.getItem('prestadoresDeServico')) ?? []

            // ADICIONAR O OBJETO JSON AO ARRAY
            prestadoresDeServico.push(prestadorServico);

            // SALVA O ARRAY NO LOCALSTORAGE
            localStorage
                .setItem(
                    'prestadoresDeServico',
                    JSON.stringify(prestadoresDeServico)
                );

            montarTabela();

        };

        // MONTA AS TABELAS
        function montarTabela() {
            const prestadoresDeServico = JSON
                .parse(localStorage.getItem('prestadoresDeServico')) ?? []


            const tabela = document.querySelector('#tabela-prestadores tbody');
            tabela.innerHTML = '';

            let conteudo = '';

            prestadoresDeServico.forEach((prestador, indice) => {
                console.log(indice);
                conteudo += `
                            <tr>
								<td>${prestador.nome}</td>	
								<td>${prestador.sobrenome}</td>
								<td>${prestador.email}</td>
								<td>${prestador.site}</td>
								<td>${prestador.dataini}</td>
								<td>${prestador.datafim}</td>
								<td>${prestador.regiao}</td>
								<td>${prestador.atividade.join('-')}</td>
								<td>
									<button class='exclusao' data-id='${indice}' >Excluir</button>
									<button class='edicao' data-id='${indice}' >Editar</button>
								</td>
							</tr>
                `;
            });
            tabela.innerHTML = conteudo;
        }

        // APAGAR
        document.querySelectorAll('.exclusao').forEach(botao => {
            botao.addEventListener('click', function () {
                const dataId = this.getAttribute('data-id');
                const prestadoresDeServico = JSON.parse(localStorage.getItem('prestadoresDeServico')) || [];

                // Remove o prestador de serviço da lista
                if (dataId >= 0 && dataId < prestadoresDeServico.length) {
                    prestadoresDeServico.splice(dataId, 1);
                    localStorage.setItem('prestadoresDeServico', JSON.stringify(prestadoresDeServico)); // Atualiza o local storage

                    montarTabela();
                    document.querySelector('form[name="formulario"]').reset();
                }
            });
        });

        // EDITAR
        document.querySelectorAll('.edicao').forEach(botao => {
            botao.addEventListener('click', function () {
                const dataId = this.getAttribute('data-id');
                const prestadoresDeServico = JSON.parse(localStorage.getItem('prestadoresDeServico')) ?? [];

                if (dataId >= 0 && dataId < prestadoresDeServico.length) {
                    const prestador = prestadoresDeServico[dataId];

                    // Preenche o formulário com os dados do prestador de serviço
                    nome.value = prestador.nome;
                    sobrenome.value = prestador.sobrenome;
                    email.value = prestador.email;
                    website.value = prestador.site;
                    dataini.value = prestador.dataini;
                    datafim.value = prestador.datafim;

                    const regiaoRadio = document.querySelector(`input[name="regiao"][value="${prestador.regiao}"]`);
                    if (regiaoRadio) {
                        regiaoRadio.checked = true;
                    }

                    const atividadesCheck = document.querySelectorAll('input[name="atividade"]:checked');
                    prestador.atividade.forEach(atividade => {
                        const checkbox = document.querySelector(`input[name="atividade"][value="${atividade}"]`);
                        if (checkbox) {
                            checkbox.checked = true;
                        }
                    });

                    // Atualiza o botão de envio do formulário para permitir a edição
                    const submit = document.querySelector('button[type="submit"]');
                    submit.textContent = 'Salvar';
                    submit.removeEventListener('click', validarForm);

                    // Salva a edição
                    submit.addEventListener('click', function (event) {
                        event.preventDefault();

                        // Atualiza o objeto
                        prestador.nome = document.querySelector('#nome').value;
                        prestador.sobrenome = document.querySelector('#sobrenome').value;
                        prestador.email = document.querySelector('#email').value;
                        prestador.site = document.querySelector('#website').value;
                        prestador.dataini = document.querySelector('#dataini').value;
                        prestador.datafim = document.querySelector('#datafim').value;
                        prestador.regiao = document.querySelector('input[name=regiao]:checked').value;
                        prestador.atividade = Array.from(document.querySelectorAll('input[name=atividade]:checked')).map(a => a.value);

                        prestadoresDeServico[dataId] = prestador;

                        localStorage.setItem('prestadoresDeServico', JSON.stringify(prestadoresDeServico));


                        montarTabela();

                        // Redefine o botão de envio para seu estado original
                        submit.textContent = 'Enviar';
                        submit.removeEventListener('click', salvarEdit);
                        submit.addEventListener('click', validarForm);

                        document.querySelector('form[name="formulario"]').reset();
                    });
                }
            });
        });

        // RESETA OS CHECKBOXES

        function resetarCheckboxes() {

            atividades.forEach(function (checkbox) {
                checkbox.checked = false;
            });
            if (regiao[2].checked) {
                atividades[1].disabled = true;
                atividades[3].disabled = true;
            } else {
                atividades[1].disabled = false;
                atividades[3].disabled = false;
            }
        }

        // APLICA O BOTÃO DE REINCIAR

        document.querySelector('#reset').addEventListener('click', function () {
            document.querySelector('#error').textContent = '';
            document.querySelector('#error2').textContent = '';
            document.querySelector('#error3').textContent = '';
            document.querySelector('#error4').textContent = '';
            document.querySelector('#error5').textContent = '';
            document.querySelector('#error6').textContent = '';
            document.querySelector('#error7').textContent = '';
            document.querySelector('#error8').textContent = '';
        });