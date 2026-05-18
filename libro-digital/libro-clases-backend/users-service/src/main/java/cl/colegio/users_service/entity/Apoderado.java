package cl.colegio.users_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "apoderados")
public class Apoderado {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @OneToOne @JoinColumn(name="usuario_id", nullable = false, unique = true) private Usuario usuario;
    @Column(length = 20) private String telefono;
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Usuario getUsuario(){return usuario;} public void setUsuario(Usuario usuario){this.usuario=usuario;}
    public String getTelefono(){return telefono;} public void setTelefono(String telefono){this.telefono=telefono;}
}
