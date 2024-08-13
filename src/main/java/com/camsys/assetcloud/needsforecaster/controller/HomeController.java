package com.camsys.assetcloud.needsforecaster.controller;

import com.camsys.assetcloud.controller.BasePage;
import com.camsys.assetcloud.auth.AssetCloudOidcUserPrincipal;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

@Controller
public class HomeController extends BasePage {

	@Value( "${asset-cloud.version}" )
	private String assetCloudVersionId = null;

	@GetMapping("/")
	public String index(Model model) throws Exception {
		return "index";
	}

	@ModelAttribute("VERSION")
	public String getVersion() {
		return assetCloudVersionId;
	}

}
