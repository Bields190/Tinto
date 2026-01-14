// Função para verificar o status da API
document.addEventListener('DOMContentLoaded', function() {
    const checkStatusBtn = document.getElementById('checkStatus');
    const statusResult = document.getElementById('statusResult');

    if (checkStatusBtn) {
        checkStatusBtn.addEventListener('click', async function() {
            statusResult.textContent = 'Verificando...';
            statusResult.className = 'status-result';

            try {
                const response = await fetch('/api/status');
                const data = await response.json();

                if (response.ok) {
                    statusResult.className = 'status-result success';
                    statusResult.innerHTML = `
                        <strong>✓ Status:</strong> ${data.status}<br>
                        <strong>Backend:</strong> ${data.backend}<br>
                        <strong>Jungle Version:</strong> ${data.jungle_version}<br>
                        <strong>Mensagem:</strong> ${data.message}
                    `;
                } else {
                    throw new Error('Erro na resposta da API');
                }
            } catch (error) {
                statusResult.className = 'status-result error';
                statusResult.innerHTML = `
                    <strong>✗ Erro:</strong> Não foi possível conectar ao backend<br>
                    <em>${error.message}</em>
                `;
            }
        });
    }
});
