import "../index.css";

import React, { useState, useEffect } from "react";
import Particles from "../asset/img/data-sphere-flop.webp";

const QuestsHero = () => {
	return (
		<div id="docs-hero">
			<div id="docs-header">
				<div id="docs-header-title">
					GM <span id="docs-header-title-nowrap">QUESTAOOOORS!</span>
				</div>
				<div id="docs-header-subtitle">Learn Web3 dev and grok our SDK</div>
			</div>

			<div id="docs-header-image">
				<img src={Particles} alt="particle sphere" width="80%" />
			</div>
		</div>
	);
};

export default QuestsHero;
