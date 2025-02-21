package com.camsys.assetcloud.needsforecaster.services.external;

import com.camsys.assetcloud.needsforecaster.controller.HomeController;
import com.camsys.assetcloud.needsforecaster.model.Asset;
import com.camsys.assetcloud.needsforecaster.model.Org;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.util.*;

@Service("AIService")
@Primary
public class WebClientAssetInventoryService implements AssetInventoryService {
    private static final Logger LOG = LoggerFactory.getLogger(WebClientAssetInventoryService.class);
    HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory ();
    private RestTemplate restTemplate = new RestTemplate(factory);
    private String server;
    private String token = null;
    private List<Org> cachedOrgs = null;

    @Override
    public List<Org> getOrgs() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.setBearerAuth(token);

        String resourceUrl = server + "/users/get/loggedInUserAttributes";
        HttpEntity<?> entity = new HttpEntity<>(headers);
        ObjectMapper mapper = new ObjectMapper();
        HashMap<String, Object> map = new HashMap<>();

        // Get logged in user attributes from Asset Inventory.
        ResponseEntity<String> rawResponse = restTemplate.exchange(resourceUrl, HttpMethod.GET, entity, String.class);

        // Parse readOrgs out of JSON
        try {
            map = mapper.readValue(rawResponse.getBody(), new TypeReference<HashMap<String, Object>>() {});
        } catch (Exception e) {
            e.printStackTrace();
        }
        List<String> orgList = (ArrayList<String>)map.get("readOrgs");

        // Convert "short_name : long_name" format to Orgs orgKey and name
        List<Org> organizations = new ArrayList<>(orgList.size());
        Org organization = null;
        for (String orgString : orgList) {
            organization = new Org();
            String[] parts = orgString.split(" : ", 2);
            organization.orgKey = parts[0];
            organization.name = parts[1];
            organizations.add(organization);
        }
        organizations.sort((o1, o2) -> o1.name.compareTo(o2.name));
        cachedOrgs = organizations;
        return organizations;
    }

    @Override
    public List<Asset> getActiveAssets(String orgKey, List<String> assetTypeKeys) throws JsonProcessingException {
        //TODO: use web client to get list of assets
        Optional<Org> optionalOrg = cachedOrgs.stream().filter((o) -> {return Objects.equals(o.orgKey, orgKey);}).findFirst();
        if (optionalOrg.isPresent()) {
            String orgName = optionalOrg.get().toString();
            List<Asset> assets = new ArrayList<>();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            headers.setBearerAuth(token);
            HttpEntity<?> entity = new HttpEntity<>(headers);

            // UriComponentsBuilder builder = UriComponentsBuilder.fromPath("/assets/{org}/{types}");
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(server).path("/assets/{org}/{types}");

            UriComponents components = builder.buildAndExpand(orgName, assetTypeKeys.toString().replace("[", "").replace("]",""));
            LOG.info(components.toUriString());
            //components = components.encode();
            LOG.info(components.toUriString());

            ResponseEntity<String> rawResponse = restTemplate.exchange(components.toUriString(), HttpMethod.GET, entity, String.class);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(rawResponse.getBody()); // Parse JSON

            if (rootNode.isArray()) {
                for (JsonNode element : (ArrayNode) rootNode) {
                    Asset asset = new Asset();
                    asset.uniqueKey = element.path("id").asText();
                    asset.orgKey = element.path("ownerOrganization").asText().split(" : ", 2)[0];
                    asset.assetTypeKey = element.path("type").asText();

                    JsonNode idElement = element.path("Identification & Classification");
                    asset.assetId = idElement.path("Asset ID").asText();
                    asset.assetSubTypeKey = idElement.path("Subtype").asText();
                    if (!idElement.path("VIN").isMissingNode()) asset.vin = idElement.path("VIN").asText();
                    if (!idElement.path("Facility Name").isMissingNode()) asset.name = idElement.path("Facility Name").asText();
                    JsonNode opsElement = element.path("Operations");
                    asset.inServiceDate = LocalDate.parse(opsElement.path("In Service Date").asText());

                    // In some cases this field contains the message "<Odometer is missing or not valid>"
                    try {
                        asset.policyReplacementYear = Integer.parseInt(opsElement.path("SOGR Replacement Date").asText().replace("FY", ""));
                    } catch (NumberFormatException e) {
                        LOG.warn("SOGR Replacement Date with value {}", opsElement.path("SOGR Replacement Date").asText());
                    }
                    if (!opsElement.path("Condition").isMissingNode()) asset.condition = opsElement.path("Condition").asText();
                    if (!opsElement.path("Odometer").isMissingNode()) asset.odometer = opsElement.path("Odometer").asInt();

                    if (!element.at("/Characteristics/Description").isMissingNode()) asset.description = element.at("/Characteristics/Description").asText();

                    assets.add(asset);
                }
            }
            return assets;
        } else {
            return List.of();
        }
    }

    @Override
    public void broadcastAssetUpdates(List<Asset> assets) {
        //TODO: use web client to post asset data changes to asset inventory module
    }

    @Override
    public void setServer(String callingServerName) {
        this.server = (Objects.equals(callingServerName, "localhost"))
                ? "http://localhost:8080"
                : String.format("https://%s", callingServerName.replace("needs-forecaster", "inventory"));
    }

    @Override
    public void setToken(String token) {
        this.token = token;
    }

    @Override
    public String testRoundTrip() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.setBearerAuth(token);

        String resourceUrl = server + "/assets/schemas/list";
        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<String> rawResponse = restTemplate.exchange(resourceUrl, HttpMethod.GET, entity, String.class);

        return rawResponse.toString();
    }
}
