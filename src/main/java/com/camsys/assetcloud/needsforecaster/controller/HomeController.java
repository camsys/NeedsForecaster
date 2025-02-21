package com.camsys.assetcloud.needsforecaster.controller;

import com.camsys.assetcloud.controller.BasePage;

import com.camsys.assetcloud.needsforecaster.services.external.AssetInventoryService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Controller
public class HomeController extends BasePage {
	private static final Logger LOG = LoggerFactory.getLogger(HomeController.class);
	private AssetInventoryService aiService;

	@Value( "${asset-cloud.version}" )
	private String assetCloudVersionId = null;

	private String username = "Mr. Nobody";

	public HomeController(@Qualifier("AIService") AssetInventoryService aiService) {
		this.aiService = aiService;
	}

	@GetMapping("/")
	public String index(HttpServletRequest request, Model model) throws Exception {
		return "index";
	}

	@GetMapping("/module")
	@ResponseBody
	public Map<String, Object> getModule(HttpServletRequest request, @RequestParam String token, @RequestParam String username) throws Exception {
		Map<String, Object> data = new HashMap<>();
		data.put("name", "Needs Forecaster");
		data.put("menu-items", new String[][]{{"Policies", "policies"},{"Projects", "projects"},{"SOGR Project Builder", "sogr-builder"}});

		aiService.setToken(token);
		aiService.setServer(request.getServerName());
		this.username = username;
		LOG.info("The called server name is: {}", request.getServerName());

		return data;
	}

	@ModelAttribute("VERSION")
	public String getVersion() {
		return assetCloudVersionId;
	}

	@ModelAttribute("USER_NAME")
	public String getUserName() {
		return username;
	}

}
