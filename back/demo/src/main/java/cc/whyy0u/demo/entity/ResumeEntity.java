package cc.whyy0u.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "resume")
public class ResumeEntity {

      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      @Column(name = "id", unique = true, nullable = false)
      Long id;

      @Column(name = "uuid", unique = false, nullable = false)
      String uuid;

      @Column(name = "description", length = 500, unique = false, nullable = false)
      String description;

      @Lob
      @Column(name = "text", columnDefinition = "TEXT", nullable = false)
      String text;

      @Column(name = "fileName", unique = false, nullable = false)
      String fileName;

      @Column(name = "name", unique = false, nullable = false)
      String name;

      @Column(name = "sum", unique = false, nullable = false)
      double sum;

      @Column(name = "org", unique = false, nullable = true)
      String org;

      @Column(name = "person", unique = false, nullable = true)
      String person;

      @Column(name = "loc", unique = false, nullable = true)
      String loc;

      @Column(name = "experience", unique = false, nullable = true)
      String experience;
}
