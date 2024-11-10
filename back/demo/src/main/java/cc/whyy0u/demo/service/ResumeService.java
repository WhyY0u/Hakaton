package cc.whyy0u.demo.service;


import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cc.whyy0u.demo.entity.ResumeEntity;
import cc.whyy0u.demo.entity.ResumeEntityFavorites;
import cc.whyy0u.demo.repository.RepositoryResume;
import cc.whyy0u.demo.repository.RepositoryResumeFavorites;

@Service
public class ResumeService {

    @Autowired
    RepositoryResume repositoryResume;

    @Autowired
    RepositoryResumeFavorites repositoryResumeFavorites;

    public ResumeEntity findResumeById(Long id) {
        return repositoryResume.findById(id).orElse(null);
    }

    public ArrayList<ResumeEntity> getAllResumeByUUID(String uuid) {
        return repositoryResume.findResumeByuuid(uuid);
    }
    public ArrayList<ResumeEntityFavorites> getAllFavoritesByUUID(String uuid) {
        return repositoryResumeFavorites.findResumeFavoritesByuuid(uuid);
    }

    public void saveRepositoryFavorites(ResumeEntityFavorites resumeEntityFavorites) {
        repositoryResumeFavorites.save(resumeEntityFavorites);
    }

    public ResumeEntityFavorites findResumeEntityFavoritesByResume_ID(Long resume_ID) {
       return repositoryResumeFavorites.findResumeFavoritesByresume_id(resume_ID);
    }
    public Page<ResumeEntity> findPageResumeByUUID(String uuid, Pageable pageable) {
          return repositoryResume.findByUuid(uuid, pageable);
    }
    public Page<ResumeEntityFavorites> findPageResumeFavoritesByUUID(String uuid, Pageable pageable) {
        return repositoryResumeFavorites.findResumeFavoritesByuuid(uuid, pageable);
    }
    public Page<ResumeEntity> findByUuidAndNameContainingOrTextContaining(String uuid, String text, Pageable pageable) {
        return repositoryResume.findByUuidAndNameContainingOrTextContaining(uuid, text, pageable);
    }
    public Page<ResumeEntityFavorites> searchFavoritesByUuidAndText(String uuid, String text, Pageable pageable) {
       return repositoryResumeFavorites.searchFavoritesByUuidAndText(uuid, text, pageable);
    }

  public void deleteResume(Long id) {
    ResumeEntityFavorites fav = findResumeEntityFavoritesByResume_ID(id);
    if(fav != null) {
        removeResumeFavorites(fav.getId());
    }
    repositoryResume.deleteById(id);
     
  }
  @Transactional
  public void removeResumeFavorites(Long id) {
    repositoryResumeFavorites.deleteByResume_Id(id);
  }
  public void saveResume(ResumeEntity resumeEntity) {
    repositoryResume.save(resumeEntity);
  }
}
