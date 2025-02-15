package com.camsys.assetcloud.needsforecaster.controller;

import com.camsys.assetcloud.controller.BasePage;

import com.camsys.assetcloud.needsforecaster.services.external.AssetInventoryService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.servlet.http.HttpServletRequest;

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
	public String index(HttpServletRequest request, Model model, @RequestParam(required = false)String token, @RequestParam(required = false)String username) throws Exception {
		aiService.setServer(request.getServerName());
		if (token != null) aiService.setToken(token);
		if (username != null) this.username = username;
		LOG.info("The called server name is: {}", request.getServerName());

		return "index";
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
