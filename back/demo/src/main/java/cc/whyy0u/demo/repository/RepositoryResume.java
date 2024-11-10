package cc.whyy0u.demo.repository;

import java.util.ArrayList;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import cc.whyy0u.demo.entity.ResumeEntity;

public interface RepositoryResume extends CrudRepository<ResumeEntity, Long> {
    ArrayList<ResumeEntity> findResumeByuuid(String uuid);
    Page<ResumeEntity> findByUuid(String uuid, Pageable pageable);
    @Query("SELECT r FROM ResumeEntity r WHERE r.uuid = :uuid AND (r.name LIKE %:text% OR r.text LIKE %:text%) ORDER BY r.sum DESC")
    Page<ResumeEntity> findByUuidAndNameContainingOrTextContaining(@Param("uuid") String uuid,
                                                                  @Param("text") String text,
                                                                  Pageable pageable);
}
