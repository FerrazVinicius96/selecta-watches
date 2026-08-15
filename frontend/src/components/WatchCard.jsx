import { useState } from 'react';
import { formatPrice } from '../utils/format';
// no topo, junto dos outros imports:
import { resolveImageUrl } from '../api/client';

export default function WatchCard({ watch, index, onSelect }) {
	const [failed, setFailed] = useState(false);
	const hasImage = Boolean(watch.image_url) && !failed;

	return (
		<article
			className="wcard"
			style={{ '--reveal-delay': `${index * 90}ms` }}
		>
			<div className="wcard__media">
				{
					hasImage ?
						<img
							src={resolveImageUrl(watch.image_url)}
							alt={`${watch.brand} ${watch.name}`}
							loading="lazy"
							onError={() => setFailed(true)}
						/>
						// Placeholder tipográfico em vez de ícone de "imagem quebrada":
						// mantém a página elegante mesmo com cadastro incompleto no admin.
					:	<div className="wcard__fallback" aria-hidden="true">
							<span>
								{watch.brand?.slice(0, 2).toUpperCase() || '—'}
							</span>
						</div>

				}
				<span className="wcard__index">
					{String(index + 1).padStart(2, '0')}
				</span>
			</div>

			<div className="wcard__body">
				<p className="wcard__brand">{watch.brand}</p>
				<h3 className="wcard__name">{watch.name}</h3>
				{watch.description && (
					<p className="wcard__desc">{watch.description}</p>
				)}

				<div className="wcard__foot">
					<span className="wcard__price">
						{formatPrice(watch.price)}
					</span>
					<button
						type="button"
						className="wcard__cta"
						onClick={() => onSelect(watch)}
					>
						Consultar peça
						<span className="wcard__arrow" aria-hidden="true">
							→
						</span>
					</button>
				</div>
			</div>
		</article>
	);
}
