package com.tinto.api.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import com.tinto.api.model.Usuario;
import com.tinto.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    private final String SECRET_KEY = "TintoSecretKey"; // MESMA CHAVE USADA NO AuthService

    @Autowired
    private UsuarioRepository usuarioRepository; 

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractNome(String token) {
        return extractClaim(token, claims -> claims.get("nome", String.class));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
    }

    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Valida o token apenas verificando subject e expiração (retrocompatível).
     */
    public Boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    /**
     * Valida o token comparando os dados extraídos com os valores atuais no banco.
     * Caso o nome ou email tenham sido alterados, o token anterior será considerado inválido.
     */
    public Boolean validateToken(String token, Usuario usuario) {
        if (usuario == null) {
            return false;
        }
        final String extractedUsername = extractUsername(token);
        final String extractedNome = extractNome(token);
        boolean matches = extractedUsername.equals(usuario.getEmail())
                && (extractedNome == null || extractedNome.equals(usuario.getNome()));
        return matches && !isTokenExpired(token);
    }
}