import { existsSync, copyFileSync } from "fs";
import { execSync } from "child_process";

// Função para verificar se um comando está disponível
function isCommandAvailable(command) {
    try {
        execSync(`${command} --version`, { stdio: "ignore" });
        return true;
    } catch {
        return false;
    }
}

// Verifica se o Docker ou Podman está instalado
const dockerAvailable = isCommandAvailable("docker");
const podmanAvailable = isCommandAvailable("podman");

if (!dockerAvailable && !podmanAvailable) {
    console.error("Erro: Nem Docker nem Podman estão instalados.");
    process.exit(1);
}

// Usa Podman se disponível, senão usa Docker
const composeCommand = dockerAvailable ? "docker compose up -d" : "podman compose up -d";

// Verifica se o arquivo .env existe, se não, copia o .env.example
if (!existsSync(".env")) {
    copyFileSync(".env.example", ".env");
}

// Executa o comando
try {
    execSync(composeCommand, { stdio: "inherit" });
} catch (error) {
    console.error("Erro ao executar o container.");
}
