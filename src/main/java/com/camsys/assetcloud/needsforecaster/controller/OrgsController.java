package com.camsys.assetcloud.needsforecaster.controller;

import com.camsys.assetcloud.needsforecaster.model.Org;
import com.camsys.assetcloud.needsforecaster.services.external.AssetInventoryService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
public class OrgsController {

    private AssetInventoryService aiService;

    public OrgsController(@Qualifier("AIService") AssetInventoryService aiService) {
        this.aiService = aiService;
    }

    @GetMapping(value = "/api/orgs", produces = "application/json")
    public List<Org> listOrgs(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        token = token != null ? token.substring(7) : null;//the substring strips off the "Bearer " text
        return aiService.getOrgs(token);
    }
}
