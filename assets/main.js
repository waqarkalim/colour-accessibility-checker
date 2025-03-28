/**
 * Chroma11y - Accessible Color Contrast Tool
 * 
 * A professional tool for designers and developers to create
 * beautiful, accessible color combinations that comply with
 * WCAG 2.1 accessibility standards.
 * 
 * Version: 1.2.0
 */

document.addEventListener('DOMContentLoaded', function() {
	// DOM Elements
	const foregroundInput = document.getElementById('foreground-color');
	const backgroundInput = document.getElementById('background-color');
	const foregroundSwatch = document.getElementById('foreground-swatch');
	const backgroundSwatch = document.getElementById('background-swatch');
	const randomButton = document.getElementById('random-button');
	const resetButton = document.getElementById('reset-button');
	const resultContainer = document.getElementById('result-container');
	const colorPreview = document.getElementById('color-preview');
	const contrastRatio = document.getElementById('contrast-ratio');
	const wcagResults = document.getElementById('wcag-results');
	const alternativesContainer = document.getElementById('alternatives-container');
	const aboutTrigger = document.querySelector('.js-about-trigger');
	const aboutModal = document.getElementById('about-modal');
	const closeModal = document.querySelector('.close-modal');
	const currentYearElement = document.getElementById('current-year');

	// Set current year in footer
	currentYearElement.textContent = new Date().getFullYear();

	// Default colors
	foregroundInput.value = '#000000';
	backgroundInput.value = '#FFFFFF';

	// Update swatches
	updateSwatches();

	// Event listeners
	randomButton.addEventListener('click', generateRandomColors);
	resetButton.addEventListener('click', resetColors);
	foregroundInput.addEventListener('input', handleInputChange);
	backgroundInput.addEventListener('input', handleInputChange);
	
	// About modal
	if (aboutTrigger) {
		aboutTrigger.addEventListener('click', function(e) {
			e.preventDefault();
			aboutModal.classList.add('active');
		});
	}

	if (closeModal) {
		closeModal.addEventListener('click', function() {
			aboutModal.classList.remove('active');
		});
	}

	// Click outside modal to close
	window.addEventListener('click', function(e) {
		if (e.target === aboutModal) {
			aboutModal.classList.remove('active');
		}
	});

	// Escape key to close modal
	window.addEventListener('keydown', function(e) {
		if (e.key === 'Escape' && aboutModal.classList.contains('active')) {
			aboutModal.classList.remove('active');
		}
	});

	// Initialize preview
	updateColorPreview();

	// Show welcome message
	showWelcomeEffect();

	// Color Palette - Curated colors from web standards
	const CURATED_COLORS = [
		// CSS Named Colors
		"black", "white", "red", "blue", "green", "yellow", "purple", "aqua", "gray", "silver", "maroon", "olive",
		"lime", "teal", "navy", "fuchsia", "orange", "pink", "gold", "cyan", "brown", "chocolate", "coral",
		"crimson", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta",
		"darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue",
		"darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dodgerblue", "firebrick",
		"forestgreen", "gainsboro", "ghostwhite", "greenyellow", "honeydew", "indianred", "indigo", "ivory", "khaki",
		"lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan",
		"lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue",
		"lightslategray", "lightsteelblue", "lightyellow", "limegreen", "linen", "mediumaquamarine", "mediumblue",
		"mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise",
		"mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "oldlace",
		"olivedrab", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred",
		"papayawhip", "peachpuff", "peru", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown",
		"salmon", "sandybrown", "seagreen", "seashell", "sienna", "skyblue", "slateblue", "slategray",
		"snow", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "wheat",
		"whitesmoke", "yellowgreen",
		
		// Web Safe Colors
		"#000000", "#330000", "#660000", "#990000", "#CC0000", "#FF0000", "#003300", "#333300", "#663300",
		"#993300", "#CC3300", "#FF3300", "#006600", "#336600", "#666600", "#996600", "#CC6600", "#FF6600",
		"#009900", "#339900", "#669900", "#999900", "#CC9900", "#FF9900", "#00CC00", "#33CC00", "#66CC00",
		"#99CC00", "#CCCC00", "#FFCC00", "#00FF00", "#33FF00", "#66FF00", "#99FF00", "#CCFF00", "#FFFF00",
		"#00FFFF", "#33FFFF", "#66FFFF", "#99FFFF", "#CCFFFF", "#FFFFFF",
		
		// Material Design Colors
		"#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688",
		"#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548", "#9E9E9E",
		"#607D8B",
		
		// Tailwind CSS Colors
		"#1E3A8A", "#9333EA", "#D97706", "#16A34A", "#DC2626", "#64748B", "#0EA5E9", "#FACC15", "#4F46E5",
		"#14B8A6", "#EC4899", "#F43F5E", "#F87171", "#22C55E", "#A3E635", "#EAB308", "#FB923C", "#38BDF8"
	];

	/**
	 * Shows a subtle welcome animation
	 */
	function showWelcomeEffect() {
		// Add a subtle entrance animation for the main container
		document.querySelector('.container').style.opacity = '0';
		document.querySelector('.container').style.transform = 'translateY(10px)';
		
		setTimeout(() => {
			document.querySelector('.container').style.transition = 'opacity 0.5s ease, transform 0.5s ease';
			document.querySelector('.container').style.opacity = '1';
			document.querySelector('.container').style.transform = 'translateY(0)';
		}, 100);
	}

	/**
	 * Handle input change with debounce
	 */
	let debounceTimeout;
	function handleInputChange(e) {
		updateColorPreview();
		updateSwatches();
		
		// Automatically check accessibility after a short delay
		clearTimeout(debounceTimeout);
		
		// Show "checking" message
		showNotification('Checking contrast...', 'info', 400);
		
		debounceTimeout = setTimeout(() => {
			checkAccessibility();
		}, 500);
	}

	/**
	 * Update color swatches next to inputs
	 */
	function updateSwatches() {
		foregroundSwatch.style.backgroundColor = foregroundInput.value;
		backgroundSwatch.style.backgroundColor = backgroundInput.value;
	}

	/**
	 * Main function to check accessibility and display results
	 */
	function checkAccessibility() {
		const foregroundColor = foregroundInput.value;
		const backgroundColor = backgroundInput.value;

		// Calculate contrast ratio
		const ratio = calculateContrastRatio(foregroundColor, backgroundColor);
		contrastRatio.textContent = ratio.toFixed(2);

		// Check WCAG compliance
		const wcagCompliance = checkWCAGCompliance(ratio);
		displayWCAGResults(wcagCompliance);

		// Generate alternatives if needed
		if (!wcagCompliance.AALargeText || !wcagCompliance.AASmallText) {
			generateAlternatives(foregroundColor, backgroundColor);
		} else {
			alternativesContainer.innerHTML = `
				<h3>All Accessibility Checks Passed! 🎉</h3>
				<p class="success-message">Your color combination meets all WCAG standards. It provides excellent readability for all users, including those with visual impairments.</p>
			`;
		}

		// Show results with animation
		resultContainer.classList.remove('hidden');
		setTimeout(() => {
			resultContainer.classList.add('visible');
			
			// Smooth scroll to results on mobile
			if (window.innerWidth < 768) {
				resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
			}
		}, 10);
	}

	/**
	 * Display a notification message
	 */
	function showNotification(message, type = 'info', duration = 3000) {
		// Remove any existing notification
		const existingNotification = document.querySelector('.notification');
		if (existingNotification) {
			existingNotification.remove();
		}
		
		// Create notification element
		const notification = document.createElement('div');
		notification.className = `notification ${type}`;
		notification.textContent = message;
		
		// Add to DOM
		document.body.appendChild(notification);
		
		// Show with animation
		setTimeout(() => {
			notification.classList.add('visible');
		}, 10);
		
		// Auto-remove after specified duration
		setTimeout(() => {
			notification.classList.remove('visible');
			setTimeout(() => {
				notification.remove();
			}, 300);
		}, duration);
	}

	/**
	 * Convert hex to RGB
	 */
	function hexToRgb(hex) {
		// Remove # if present
		hex = hex.replace('#', '');

		// Handle shorthand hex
		if (hex.length === 3) {
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		}

		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);

		return { r, g, b };
	}

	/**
	 * Calculate relative luminance for WCAG
	 * https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
	 */
	function calculateLuminance(rgb) {
		// Convert RGB to sRGB
		let r = rgb.r / 255;
		let g = rgb.g / 255;
		let b = rgb.b / 255;

		// Apply transformation
		r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
		g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
		b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

		// Calculate luminance
		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	}

	/**
	 * Calculate contrast ratio between two colors
	 */
	function calculateContrastRatio(color1, color2) {
		const lum1 = calculateLuminance(hexToRgb(color1));
		const lum2 = calculateLuminance(hexToRgb(color2));

		// Determine lighter and darker
		const lighter = Math.max(lum1, lum2);
		const darker = Math.min(lum1, lum2);

		// Calculate ratio
		return (lighter + 0.05) / (darker + 0.05);
	}

	/**
	 * Check if the contrast ratio meets WCAG standards
	 */
	function checkWCAGCompliance(ratio) {
		return {
			AALargeText: ratio >= 3.0,
			AASmallText: ratio >= 4.5,
			AAALargeText: ratio >= 4.5,
			AAASmallText: ratio >= 7.0
		};
	}

	/**
	 * Display WCAG compliance results
	 */
	function displayWCAGResults(compliance) {
		wcagResults.innerHTML = `
      <h3>WCAG 2.1 Compliance</h3>
      <ul>
        <li class="${compliance.AALargeText ? 'pass' : 'fail'}">
          AA Large Text (3:1) <span>${compliance.AALargeText ? 'Pass ✓' : 'Fail ✗'}</span>
        </li>
        <li class="${compliance.AASmallText ? 'pass' : 'fail'}">
          AA Small Text (4.5:1) <span>${compliance.AASmallText ? 'Pass ✓' : 'Fail ✗'}</span>
        </li>
        <li class="${compliance.AAALargeText ? 'pass' : 'fail'}">
          AAA Large Text (4.5:1) <span>${compliance.AAALargeText ? 'Pass ✓' : 'Fail ✗'}</span>
        </li>
        <li class="${compliance.AAASmallText ? 'pass' : 'fail'}">
          AAA Small Text (7:1) <span>${compliance.AAASmallText ? 'Pass ✓' : 'Fail ✗'}</span>
        </li>
      </ul>
    `;
	}

	/**
	 * Generate alternative color suggestions
	 */
	function generateAlternatives(foreground, background) {
		const frgRgb = hexToRgb(foreground);
		const bkgRgb = hexToRgb(background);

		// Determine which color to adjust (usually foreground)
		let adjustForeground = calculateLuminance(frgRgb) < calculateLuminance(bkgRgb);
		
		let alternatives = [];
		let attemptsLimit = 20; // Prevent infinite loops
		
		// Generate high contrast black/white alternatives first (guaranteed to be compliant)
		alternatives.push({
			foreground: calculateLuminance(bkgRgb) < 0.5 ? '#FFFFFF' : '#000000',
			background
		});
		
		// If background is very light or very dark, create a compliant alternative with the opposite
		alternatives.push({
			foreground,
			background: calculateLuminance(bkgRgb) < 0.5 ? '#FFFFFF' : '#000000'
		});
		
		// Generate additional alternatives until we have 4 compliant options
		while (alternatives.length < 4 && attemptsLimit > 0) {
			attemptsLimit--;
			
			// Try adjusting foreground with varying intensities
			if (adjustForeground) {
				const intensity = Math.random() * 0.8 + 0.2; // 0.2 to 1.0
				let adjustedColor;
				
				if (calculateLuminance(frgRgb) < calculateLuminance(bkgRgb)) {
					// If foreground is darker than background, make it even darker or much lighter
					adjustedColor = Math.random() > 0.5 ? 
						darkenColor(foreground, intensity) : 
						lightenColor(foreground, intensity);
				} else {
					// If foreground is lighter than background, make it even lighter or much darker
					adjustedColor = Math.random() > 0.5 ? 
						lightenColor(foreground, intensity) : 
						darkenColor(foreground, intensity);
				}
				
				const newAlternative = {
					foreground: adjustedColor,
					background
				};
				
				// Check if this alternative is compliant (at least AA Small Text)
				const ratio = calculateContrastRatio(newAlternative.foreground, newAlternative.background);
				const compliance = checkWCAGCompliance(ratio);
				
				if (compliance.AASmallText && !isDuplicate(alternatives, newAlternative)) {
					alternatives.push(newAlternative);
				}
			} 
			// Try adjusting background with varying intensities
			else {
				const intensity = Math.random() * 0.8 + 0.2; // 0.2 to 1.0
				let adjustedColor;
				
				if (calculateLuminance(bkgRgb) < calculateLuminance(frgRgb)) {
					// If background is darker than foreground, make it even darker or much lighter
					adjustedColor = Math.random() > 0.5 ? 
						darkenColor(background, intensity) : 
						lightenColor(background, intensity);
				} else {
					// If background is lighter than foreground, make it even lighter or much darker
					adjustedColor = Math.random() > 0.5 ? 
						lightenColor(background, intensity) : 
						darkenColor(background, intensity);
				}
				
				const newAlternative = {
					foreground,
					background: adjustedColor
				};
				
				// Check if this alternative is compliant (at least AA Small Text)
				const ratio = calculateContrastRatio(newAlternative.foreground, newAlternative.background);
				const compliance = checkWCAGCompliance(ratio);
				
				if (compliance.AASmallText && !isDuplicate(alternatives, newAlternative)) {
					alternatives.push(newAlternative);
				}
			}
			
			// Switch between adjusting foreground and background
			if (attemptsLimit % 5 === 0) {
				adjustForeground = !adjustForeground;
			}
		}
		
		// If we still don't have enough alternatives, add some high contrast variations
		while (alternatives.length < 4) {
			// Create variations of black and white with slight tints
			const hue = Math.floor(Math.random() * 360);
			const newAlternative = Math.random() > 0.5 ? 
				{
					foreground: `hsl(${hue}, 15%, 10%)`,
					background: `hsl(${hue}, 15%, 95%)`
				} : 
				{
					foreground: `hsl(${hue}, 15%, 95%)`,
					background: `hsl(${hue}, 15%, 10%)`
				};
			
			if (!isDuplicate(alternatives, newAlternative)) {
				alternatives.push(newAlternative);
			}
		}
		
		// Ensure we only have 4 alternatives
		alternatives = alternatives.slice(0, 4);
		
		// Display alternatives
		displayAlternatives(alternatives);
	}
	
	/**
	 * Check if a color alternative is already in the list (avoid duplicates)
	 */
	function isDuplicate(alternatives, newAlternative) {
		return alternatives.some(alt => {
			const fg1 = alt.foreground || alt;
			const bg1 = alt.background || backgroundInput.value;
			const fg2 = newAlternative.foreground;
			const bg2 = newAlternative.background;
			
			// Consider similar colors as duplicates (within a small threshold)
			const fgSimilar = colorSimilarity(fg1, fg2) < 10;
			const bgSimilar = colorSimilarity(bg1, bg2) < 10;
			
			return fgSimilar && bgSimilar;
		});
	}
	
	/**
	 * Calculate color similarity (Euclidean distance in RGB space)
	 */
	function colorSimilarity(color1, color2) {
		const rgb1 = hexToRgb(color1);
		const rgb2 = hexToRgb(color2);
		
		const rDiff = rgb1.r - rgb2.r;
		const gDiff = rgb1.g - rgb2.g;
		const bDiff = rgb1.b - rgb2.b;
		
		return Math.sqrt(rDiff*rDiff + gDiff*gDiff + bDiff*bDiff);
	}

	/**
	 * Darken a color by a specified amount
	 */
	function darkenColor(hex, amount) {
		const rgb = hexToRgb(hex);
		const darkerRgb = {
			r: Math.max(0, Math.floor(rgb.r * (1 - amount))),
			g: Math.max(0, Math.floor(rgb.g * (1 - amount))),
			b: Math.max(0, Math.floor(rgb.b * (1 - amount)))
		};
		return rgbToHex(darkerRgb);
	}

	/**
	 * Lighten a color by a specified amount
	 */
	function lightenColor(hex, amount) {
		const rgb = hexToRgb(hex);
		const lighterRgb = {
			r: Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * amount)),
			g: Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * amount)),
			b: Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * amount))
		};
		return rgbToHex(lighterRgb);
	}

	/**
	 * Convert RGB to Hex
	 */
	function rgbToHex(rgb) {
		return '#' +
			((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b)
				.toString(16).slice(1).toUpperCase();
	}

	/**
	 * Adjust saturation and lightness while maintaining hue
	 */
	function adjustSaturationAndLightness(hex) {
		// Simple approach - increase contrast by making dark colors darker
		// and light colors lighter
		const lum = calculateLuminance(hexToRgb(hex));
		let adjustedColor;

		if (lum < 0.2) {
			adjustedColor = '#000000';
		} else if (lum > 0.8) {
			adjustedColor = '#FFFFFF';
		} else if (lum < 0.5) {
			adjustedColor = darkenColor(hex, 0.5);
		} else {
			adjustedColor = lightenColor(hex, 0.5);
		}

		return {
			foreground: adjustedColor,
			background: hex
		};
	}

	/**
	 * Display alternative color suggestions
	 */
	function displayAlternatives(alternatives) {
		let html = '<h3>Suggested Alternatives</h3>';
		html += '<div class="alternatives-grid">';

		alternatives.forEach((alt, index) => {
			const fg = alt.foreground || alt;
			const bg = alt.background || backgroundInput.value;
			const ratio = calculateContrastRatio(fg, bg).toFixed(2);
			const compliance = checkWCAGCompliance(parseFloat(ratio));
			
			// Only display alternatives that are at least AA Small Text compliant
			if (!compliance.AASmallText) {
				return;
			}

			let complianceText = '';
			if (compliance.AAASmallText) {
				complianceText = '<span class="compliance-level highest">AAA</span>';
			} else if (compliance.AASmallText) {
				complianceText = '<span class="compliance-level high">AA</span>';
			} else if (compliance.AALargeText) {
				complianceText = '<span class="compliance-level medium">AA Large</span>';
			}

			html += `
        <div class="alternative">
          <div class="alternative-preview" style="color: ${fg}; background-color: ${bg};">
            Sample Text
          </div>
          <div class="alternative-info">
            <div>Text: <span class="color-code">${fg}</span></div>
            <div>Background: <span class="color-code">${bg}</span></div>
            <div>Contrast: ${ratio} ${complianceText}</div>
            <button class="apply-button" data-fg="${fg}" data-bg="${bg}">Apply</button>
          </div>
        </div>
      `;
		});

		html += '</div>';
		
		// If no alternatives were displayed, show a message
		if (!html.includes('alternative-preview')) {
			html = '<h3>Suggested Alternatives</h3><p>We couldn\'t generate compliant alternatives. Try adjusting your colors slightly.</p>';
		}
		
		alternativesContainer.innerHTML = html;

		// Add event listeners to apply buttons
		document.querySelectorAll('.apply-button').forEach(button => {
			button.addEventListener('click', function() {
				// Store reference to the clicked button
				const clickedButton = this;
				
				// Disable all apply buttons
				document.querySelectorAll('.apply-button').forEach(btn => {
					btn.disabled = true;
					btn.classList.add('disabled');
				});
				
				foregroundInput.value = this.dataset.fg;
				backgroundInput.value = this.dataset.bg;
				updateColorPreview();
				updateSwatches();
				checkAccessibility();
				
				// Show feedback
				showNotification('Colors applied successfully!', 'success');
				
				// Check if the selected colors are accessible
				const ratio = calculateContrastRatio(this.dataset.fg, this.dataset.bg);
				const wcagCompliance = checkWCAGCompliance(ratio);
				
				// If colors are accessible, scroll to the top
				if (wcagCompliance.AALargeText || wcagCompliance.AASmallText) {
					window.scrollTo({ top: 0, behavior: 'smooth' });
				}
				
				// Re-enable all apply buttons after a short delay
				setTimeout(() => {
					document.querySelectorAll('.apply-button').forEach(btn => {
						btn.disabled = false;
						btn.classList.remove('disabled');
					});
					
					// Restore focus to the clicked button
					if (clickedButton && document.body.contains(clickedButton)) {
						clickedButton.focus();
					}
				}, 500);
			});
		});
	}

	/**
	 * Update the color preview area
	 */
	function updateColorPreview() {
		const foreground = foregroundInput.value;
		const background = backgroundInput.value;

		if (isValidHex(foreground) && isValidHex(background)) {
			colorPreview.style.color = foreground;
			colorPreview.style.backgroundColor = background;
		}
	}

	/**
	 * Generate random colors
	 */
	function generateRandomColors() {
		// Prevent multiple clicks
		randomButton.disabled = true;
		randomButton.classList.add('disabled');
		
		// Pick two different random colors from the curated list
		const colorIndex1 = Math.floor(Math.random() * CURATED_COLORS.length);
		let colorIndex2 = Math.floor(Math.random() * CURATED_COLORS.length);
		
		// Ensure we don't get the same color for both (especially important for contrast)
		while (colorIndex2 === colorIndex1) {
			colorIndex2 = Math.floor(Math.random() * CURATED_COLORS.length);
		}
		
		let foreground = CURATED_COLORS[colorIndex1];
		let background = CURATED_COLORS[colorIndex2];
		
		// Convert named colors to hex if needed
		if (foreground.charAt(0) !== '#') {
			foreground = nameToHex(foreground);
		}
		
		if (background.charAt(0) !== '#') {
			background = nameToHex(background);
		}
		
		// Ensure hex codes are properly formatted for color inputs (lowercase, 6 characters)
		foreground = ensureProperHexFormat(foreground);
		background = ensureProperHexFormat(background);
		
		foregroundInput.value = foreground;
		backgroundInput.value = background;
		
		updateColorPreview();
		updateSwatches();
		
		// Show checking message first
		showNotification('Checking contrast...', 'info', 400);
		
		// Small delay for notification to be visible
		setTimeout(() => {
			checkAccessibility();
			
			// Re-enable button after processing is complete
			randomButton.disabled = false;
			randomButton.classList.remove('disabled');
			
			// Restore focus to the button for better keyboard navigation
			randomButton.focus();
		}, 500);
	}

	/**
	 * Ensure hex color is properly formatted for color inputs
	 */
	function ensureProperHexFormat(hex) {
		// Remove # if present
		hex = hex.replace('#', '');
		
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		if (hex.length === 3) {
			hex = hex.split('').map(char => char + char).join('');
		}
		
		// Ensure lowercase and add # prefix
		return '#' + hex.toLowerCase();
	}

	/**
	 * Convert a color name to its hex value using a temporary element
	 */
	function nameToHex(colorName) {
		const tempElement = document.createElement('div');
		tempElement.style.color = colorName;
		document.body.appendChild(tempElement);
		
		// Get computed color value
		const computedColor = window.getComputedStyle(tempElement).color;
		document.body.removeChild(tempElement);
		
		// Convert RGB to hex
		if (computedColor.startsWith('rgb')) {
			const rgb = computedColor.match(/\d+/g);
			if (rgb && rgb.length >= 3) {
				return '#' + 
					parseInt(rgb[0]).toString(16).padStart(2, '0') +
					parseInt(rgb[1]).toString(16).padStart(2, '0') +
					parseInt(rgb[2]).toString(16).padStart(2, '0');
			}
		}
		
		// Return the original if conversion failed
		return colorName;
	}

	/**
	 * Reset to default colors
	 */
	function resetColors() {
		// Prevent multiple clicks
		resetButton.disabled = true;
		resetButton.classList.add('disabled');
		
		// Reset to default colors
		foregroundInput.value = '#000000';
		backgroundInput.value = '#FFFFFF';
		
		updateColorPreview();
		updateSwatches();
		
		// Hide result container
		resultContainer.classList.remove('visible');
		
		// Small delay to match the transition duration
		setTimeout(() => {
			resultContainer.classList.add('hidden');
			
			// Re-enable button after processing is complete
			resetButton.disabled = false;
			resetButton.classList.remove('disabled');
			
			// Restore focus to the button for better keyboard navigation
			resetButton.focus();
		}, 300);
	}

	/**
	 * Validate hex color format
	 */
	function isValidHex(color) {
		return /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(color);
	}
}); 