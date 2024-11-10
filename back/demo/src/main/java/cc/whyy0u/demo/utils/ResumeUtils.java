package cc.whyy0u.demo.utils;

import cc.whyy0u.demo.entity.ResumeEntity;

public class ResumeUtils {
    
    public static String buildDesciptionByResume(ResumeEntity resumeEntity) {
       String desciption = "";
       if(resumeEntity.getOrg() != null) desciption += "Организации: " + resumeEntity.getOrg() + " \n";
       if(resumeEntity.getLoc() != null) desciption += "Живет в: " + resumeEntity.getLoc() + " \n";
       if(resumeEntity.getExperience() != null) desciption += "Опыт: " + resumeEntity.getExperience() + " \n";                 
      return desciption;
    }
}
