

import React from 'react';

function Footer() {
	return (
		<footer
			className="py-8 flex flex-col items-center gap-2 border-t border-white/10"
			style={{
				background: 'linear-gradient(to bottom, #0B0E18, #151B2C)',
				color: '#9CA3AF',
			}}
		>
			<div className="font-bold text-xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
				IP Quotation
			</div>
			<div className="text-sm text-gray-400 mt-1">Streamlining IP services quotation for professionals worldwide</div>
			<div className="flex items-center gap-4 mt-4">
				<span className="text-gray-400 text-sm">© {new Date().getFullYear()} IP Quotation. All rights reserved.</span>
				<span className="text-gray-400">|</span>
				<a
					href="mailto:support@ipquotation.com"
					className="text-gray-400 hover:text-amber-400 transition-colors text-sm"
				>
					Contact Us
				</a>
			</div>
		</footer>
	);
}

export default Footer;
