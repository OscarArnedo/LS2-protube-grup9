package com.tecnocampus.LS2.protube_back.persistance;

import com.tecnocampus.LS2.protube_back.domain.User;
import com.tecnocampus.LS2.protube_back.domain.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> getVideosByOwner(User owner);
}
