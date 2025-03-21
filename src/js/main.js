/**
 * Color Contrast Accessibility Checker
 * 
 * Checks color combinations against WCAG 2.1 accessibility standards
 * and suggests alternatives for non-compliant combinations.
 */

document.addEventListener('DOMContentLoaded', function() {
	// DOM Elements
	const foregroundInput = document.getElementById('foreground-color');
	const backgroundInput = document.getElementById('background-color');
	const checkButton = document.getElementById('check-button');
	const randomButton = document.getElementById('random-button');
	const resetButton = document.getElementById('reset-button');
	const resultContainer = document.getElementById('result-container');
	const colorPreview = document.getElementById('color-preview');
	const contrastRatio = document.getElementById('contrast-ratio');
	const wcagResults = document.getElementById('wcag-results');
	const alternativesContainer = document.getElementById('alternatives-container');

	// Default colors
	foregroundInput.value = '#000000';
	backgroundInput.value = '#FFFFFF';

	// Event listeners
	checkButton.addEventListener('click', checkAccessibility);
	randomButton.addEventListener('click', generateRandomColors);
	resetButton.addEventListener('click', resetColors);
	foregroundInput.addEventListener('input', handleInputChange);
	backgroundInput.addEventListener('input', handleInputChange);
	
	// Handle keypresses in input fields
	foregroundInput.addEventListener('keydown', handleKeyDown);
	backgroundInput.addEventListener('keydown', handleKeyDown);

	// Initialize preview
	updateColorPreview();

	/**
	 * Handler for key presses in input fields
	 */
	function handleKeyDown(e) {
		// Run check when pressing Enter
		if (e.key === 'Enter') {
			checkAccessibility();
		}
		
		// Add # automatically if typing directly a hex code
		if (!e.target.value.startsWith('#') && e.key.match(/[0-9a-f]/i)) {
			e.target.value = '#';
		}
	}
	
	/**
	 * Handle input change with debounce
	 */
	let debounceTimeout;
	function handleInputChange(e) {
		updateColorPreview();
		
		// Automatically check accessibility after a short delay
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			if (isValidHex(foregroundInput.value) && isValidHex(backgroundInput.value)) {
				checkAccessibility();
			}
		}, 500);
	}

	/**
	 * Main function to check accessibility and display results
	 */
	function checkAccessibility() {
		const foregroundColor = foregroundInput.value;
		const backgroundColor = backgroundInput.value;

		if (!isValidHex(foregroundColor) || !isValidHex(backgroundColor)) {
			alert('Please enter valid hex colors (e.g., #000000)');
			return;
		}

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
			alternativesContainer.innerHTML = '<p>Great! Your color combination meets all WCAG standards.</p>';
		}

		// Show results with animation
		resultContainer.classList.remove('hidden');
		setTimeout(() => {
			resultContainer.classList.add('visible');
		}, 10);
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
				foregroundInput.value = this.dataset.fg;
				backgroundInput.value = this.dataset.bg;
				updateColorPreview();
				checkAccessibility();
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
		foregroundInput.value = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
		backgroundInput.value = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
		updateColorPreview();
		checkAccessibility();
	}

	/**
	 * Reset to default colors
	 */
	function resetColors() {
		foregroundInput.value = '#000000';
		backgroundInput.value = '#FFFFFF';
		updateColorPreview();
		resultContainer.classList.remove('visible');
		setTimeout(() => {
			resultContainer.classList.add('hidden');
		}, 300);
	}

	/**
	 * Validate hex color format
	 */
	function isValidHex(color) {
		return /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(color);
	}
}); 