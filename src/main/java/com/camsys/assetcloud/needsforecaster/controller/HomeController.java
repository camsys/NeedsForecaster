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

@Controller
public class HomeController extends BasePage {
	private static final Logger LOG = LoggerFactory.getLogger(HomeController.class);
	private AssetInventoryService aiService;

	@Value( "${asset-cloud.version}" )
	private String assetCloudVersionId = null;

	@Value("${module-info.menu-json}")
	private String menuJson;

	public HomeController(@Qualifier("AIService") AssetInventoryService aiService) {
		this.aiService = aiService;
	}

	@GetMapping("/")
	public String index(HttpServletRequest request, Model model) throws Exception {
		return "index";
	}

	@GetMapping(value = "/module", produces = "application/json")
	@ResponseBody
	public String getModule(HttpServletRequest request) throws Exception {
		aiService.setServer(request.getServerName());//can set this here since only one AI server will be calling this instance of NF
		LOG.info("The called server name is: {}", request.getServerName());

		return this.menuJson;
	}

	@ModelAttribute("VERSION")
	public String getVersion() {
		return assetCloudVersionId;
	}

}
