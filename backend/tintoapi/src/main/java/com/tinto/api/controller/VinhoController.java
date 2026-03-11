package com.tinto.api.controller;

import com.tinto.api.dto.VinhoDTO;
import com.tinto.api.model.FotoVinho;
import com.tinto.api.model.Usuario;
import com.tinto.api.model.Vinho;
import com.tinto.api.repository.FotoVinhoRepository;
import com.tinto.api.repository.UsuarioRepository;
import com.tinto.api.repository.VinhoRepository;
import com.tinto.api.service.FileStorageService;
import com.tinto.api.service.VinhoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/vinhos")
public class VinhoController {

    @Autowired
    private VinhoService vinhoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private FotoVinhoRepository fotoVinhoRepository;

    @Autowired
    private VinhoRepository vinhoRepository;

    @GetMapping("/buscar")
    public ResponseEntity<List<Vinho>> filtrarVinhos(
            @RequestParam(required = false) String termo,
            @RequestParam(required = false) Integer safra,
            @RequestParam(required = false) Double teorAlcoolico,
            @RequestParam(required = false) LocalDate dataConsumo,
            @RequestParam(required = false) Integer avaliacao,
            @RequestParam(required = false) Boolean isFavorito,
            @AuthenticationPrincipal UserDetails userDetails) {

        Usuario usuario = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        List<Vinho> resultados = vinhoRepository.buscarComFiltros(
                usuario.getId(), termo, safra, teorAlcoolico, dataConsumo, avaliacao, isFavorito);

        return ResponseEntity.ok(resultados);
    }

    @PostMapping("/registrar")
    public ResponseEntity<Vinho> registrarVinho(@RequestBody Vinho vinho,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // Objeto Usuario completo do banco usando o email vindo do Token
        Usuario usuarioLogado = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        vinho.setUsuario(usuarioLogado);
        Vinho novoVinho = vinhoService.registrarVinho(vinho);
        return new ResponseEntity<>(novoVinho, HttpStatus.CREATED);
    }

    @GetMapping("/meus-vinhos")
    public ResponseEntity<List<Vinho>> listarMeusVinhos(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Usuario usuarioLogado = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        List<Vinho> vinhos = vinhoService.buscarVinhosPorUsuario(usuarioLogado.getId());

        return new ResponseEntity<>(vinhos, HttpStatus.OK);
    }

    @PostMapping("/{id}/upload-fotos")
    public ResponseEntity<?> uploadFotos(
            @PathVariable Long id,
            @RequestParam("fotos") MultipartFile[] fotos,
            @AuthenticationPrincipal UserDetails userDetails) {

        Vinho vinho = vinhoService.buscarPorId(id);

        if (!vinho.getUsuario().getEmail().equals(userDetails.getUsername())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        int fotosJaExistentes = fotoVinhoRepository.countByVinhoId(id);
        if (fotosJaExistentes + fotos.length > 3) {
            return new ResponseEntity<>("Limite excedido! Você já tem " + fotosJaExistentes +
                    " fotos e tentou enviar mais " + fotos.length, HttpStatus.BAD_REQUEST);
        }

        for (MultipartFile foto : fotos) {
            if (!foto.isEmpty()) {
                String nomeArquivo = fileStorageService.salvarArquivo(foto);

                FotoVinho novaFoto = new FotoVinho();
                novaFoto.setArquivoPath(nomeArquivo);
                novaFoto.setVinho(vinho);
                fotoVinhoRepository.save(novaFoto);
            }
        }

        return ResponseEntity.ok("Fotos adicionadas com sucesso!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vinho> atualizarVinho(@PathVariable Long id,
            @RequestBody Vinho vinhoDadosNovos,
            @AuthenticationPrincipal UserDetails userDetails) {
        // Verifica login
        if (userDetails == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // Busca o vinho existente
        Vinho vinhoExistente = vinhoService.buscarPorId(id);
        Usuario usuarioLogado = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        if (!vinhoExistente.getUsuario().getId().equals(usuarioLogado.getId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        // Atualiza os campos
        vinhoExistente.setNome(vinhoDadosNovos.getNome());
        vinhoExistente.setVinicola(vinhoDadosNovos.getVinicola());
        vinhoExistente.setSafra(vinhoDadosNovos.getSafra());
        vinhoExistente.setPais(vinhoDadosNovos.getPais());
        vinhoExistente.setTeorAlcoolico(vinhoDadosNovos.getTeorAlcoolico());
        vinhoExistente.setTipoUva(vinhoDadosNovos.getTipoUva());
        vinhoExistente.setComentario(vinhoDadosNovos.getComentario());
        vinhoExistente.setAvaliacao(vinhoDadosNovos.getAvaliacao());
        vinhoExistente.setIsFavorito(vinhoDadosNovos.getIsFavorito());
        vinhoExistente.setHarmonizacoes(vinhoDadosNovos.getHarmonizacoes());

        Vinho atualizado = vinhoService.registrarVinho(vinhoExistente);
        return ResponseEntity.ok(atualizado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vinho> buscarDetalhes(@PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        // Validar se o usuário está autenticado
        if (userDetails == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // Busca o vinho pelo ID
        Vinho vinho = vinhoService.buscarPorId(id);

        // Verificar se o vinho pertence ao usuário do Token
        if (!vinho.getUsuario().getEmail().equals(userDetails.getUsername())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        return ResponseEntity.ok(vinho);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarVinho(@PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // Busca o vinho e o usuário
        Vinho vinho = vinhoService.buscarPorId(id);
        Usuario usuarioLogado = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!vinho.getUsuario().getId().equals(usuarioLogado.getId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        // Executa o delete
        vinhoService.deletarVinho(vinho);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/grid")
    public ResponseEntity<List<VinhoDTO>> listarParaGrid(@AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        List<VinhoDTO> vinhosGrid = vinhoService.buscarVinhosComCapa(usuario.getId());
        return ResponseEntity.ok(vinhosGrid);
    }
}