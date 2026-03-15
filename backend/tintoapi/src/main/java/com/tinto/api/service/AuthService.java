package com.tinto.api.service;

import com.tinto.api.model.Usuario;
import com.tinto.api.repository.UsuarioRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private final Map<String, String> resetCodes = new ConcurrentHashMap<>();

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private final String SECRET_KEY = "TintoSecretKey"; // Chave secreta para o JWT

    public String login(String email, String senha) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isPresent() && passwordEncoder.matches(senha, usuarioOpt.get().getSenha())) {
            // Gera o Token JWT com informações do usuário
            return generateToken(usuarioOpt.get());
        }
        throw new RuntimeException("Credenciais inválidas");
    }

    public void solicitarRedefinicaoSenha(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        String codigo = String.format("%06d", new Random().nextInt(999999));
        resetCodes.put(email, codigo);
        System.out.println("[DEBUG] Código de redefinição para " + email + " = " + codigo);
        // TODO: enviar email via serviço de email real.
    }

    public boolean verificarCodigoRedefinicao(String email, String codigo) {
        if (!resetCodes.containsKey(email)) {
            return false;
        }
        String codigoEsperado = resetCodes.get(email);
        return codigoEsperado.equals(codigo);
    }

    public void redefinirSenha(String email, String codigo, String novaSenha) {
        if (!verificarCodigoRedefinicao(email, codigo)) {
            throw new IllegalArgumentException("Código inválido ou expirado");
        }

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);
        resetCodes.remove(email);
    }

    /**
     * Cria um token JWT para o usuário fornecido. O token inclui o email como subject
     * e adiciona outros dados que possam ser relevantes, como o nome do usuário.
     * Isso permite que, ao alterar um desses dados, um novo token seja reemitido.
     */
    public String generateToken(Usuario usuario) {
        return Jwts.builder()
                .setSubject(usuario.getEmail())
                .claim("nome", usuario.getNome())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 dia
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }
}