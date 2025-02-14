package com.camsys.assetcloud.needsforecaster.services.external;

import com.camsys.assetcloud.needsforecaster.controller.HomeController;
import com.camsys.assetcloud.needsforecaster.model.Asset;
import com.camsys.assetcloud.needsforecaster.model.Org;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service("AIService")
@Primary
public class WebClientAssetInventoryService implements AssetInventoryService {
    private static final Logger LOG = LoggerFactory.getLogger(WebClientAssetInventoryService.class);
    HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory ();
    private RestTemplate restTemplate = new RestTemplate(factory);
    private String token = null;

    @Override
    public List<Org> getOrgs() {
        //TODO: use web client to get list of orgs
        return List.of();
    }

    @Override
    public List<Asset> getActiveAssets(String orgKey, List<String> assetTypeKeys) {
        //TODO: use web client to get list of assets
        return List.of();
    }

    @Override
    public void broadcastAssetUpdates(List<Asset> assets) {
        //TODO: use web client to post asset data changes to asset inventory module
    }

    @Override
    public void setToken(String token) {
        LOG.info("token: {}", token);
        this.token = token;
    }

    @Override
    public String testRoundTrip() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.setBearerAuth(token);

        String resourceUrl = "http://localhost:8080/assets/schemas/list";
        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<String> rawResponse = restTemplate.exchange(resourceUrl, HttpMethod.GET, entity, String.class);

        return rawResponse.toString();
    }
}
