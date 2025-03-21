"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-floating-promises */
var bcrypt = require("bcrypt");
// ^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$
// regex para os requisitos da senha
var registroTeste = [];
//essa primeira parte é pra mostra uma variável que vai receber os seguintes parametros, para fins de testes mesmo
// async function registrarSite(
//   usuario: string,
//   senhaPura: string,
//   email: string,
// )
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // variáveis VERDADEIRAS para testes dentro do programa
            return [4 /*yield*/, registrarSite('correto', 'Asd12#')];
            case 1:
                // variáveis VERDADEIRAS para testes dentro do programa
                _a.sent();
                return [4 /*yield*/, entrarSite('correto', 'Asd12#')];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
//aqui é um comando que já existe para SIMULAR um banco de dados, só pra validar se o login está sendo possível de entrar
function registrarSite(usuario, senhaPura) {
    return __awaiter(this, void 0, void 0, function () {
        function checarSenha(senhaPura) {
            var regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).+$/;
            return regex.test(senhaPura);
        }
        var saltRounds, hash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!checarSenha(senhaPura)) return [3 /*break*/, 1];
                    console.log('Senha não corresponde os requisitos necessários');
                    return [3 /*break*/, 3];
                case 1:
                    saltRounds = 10;
                    return [4 /*yield*/, bcrypt.hash(senhaPura, saltRounds)];
                case 2:
                    hash = _a.sent();
                    registroTeste.push({
                        usuario: usuario,
                        senhaPura: hash,
                        email: ''
                    });
                    console.log('Usuário cadastrado com sucesso');
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
//essa primeira function é usada para salvar o usuário no banco de dados, ou seja, tudo que
//o usuário digitar no formulário vão ser armazenados e então quando ele for tentar entrar de novo
//vai ser testado os dados dele
//essa parte é pra validar se os dados que o usuário colocar aqui são verdadeiros para poder
//fazer login sem problemas
function entrarSite(usuario, senhaPura) {
    return __awaiter(this, void 0, void 0, function () {
        var checarUser, senhaCerta;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    checarUser = registroTeste.find(function (p) { return p.usuario === usuario; });
                    if (!checarUser) {
                        console.log('Usuário não existe');
                        return [2 /*return*/];
                    }
                    else {
                        console.log('usuário válido, digite a senha');
                    }
                    return [4 /*yield*/, bcrypt.compare(senhaPura, checarUser.senhaPura)];
                case 1:
                    senhaCerta = _a.sent();
                    if (!senhaCerta) {
                        console.log('Senha Inválida');
                    }
                    else {
                        console.log('Senha certa, bem-vindo');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
