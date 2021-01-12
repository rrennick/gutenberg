/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	Button,
	Spinner,
	VisuallyHidden,
	__unstableCompositeItem as CompositeItem,
} from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import BlockRatings from '../block-ratings';
import DownloadableBlockIcon from '../downloadable-block-icon';
import { store as blockDirectoryStore } from '../../store';

function DownloadableBlockListItem( { composite, item, onClick } ) {
	const { author, description, icon, rating, ratingCount, title } = item;

	const { isInstalling, isInstallable } = useSelect(
		( select ) => {
			const {
				getErrorNoticeForBlock,
				isInstalling: isBlockInstalling,
			} = select( blockDirectoryStore );
			const notice = getErrorNoticeForBlock( item.id );
			const hasFatal = notice && notice.isFatal;
			return {
				isInstalling: isBlockInstalling( item.id ),
				isInstallable: ! hasFatal,
			};
		},
		[ item ]
	);

	return (
		<div className="block-directory-downloadable-block-list-item">
			<CompositeItem
				role="option"
				as={ Button }
				{ ...composite }
				className="block-directory-downloadable-block-list-item__item"
				onClick={ ( event ) => {
					event.preventDefault();
					onClick();
				} }
				isBusy={ isInstalling }
				disabled={ isInstalling || ! isInstallable }
			>
				<DownloadableBlockIcon icon={ icon } title={ title } />
				<span className="block-directory-downloadable-block-list-item__details">
					{ isInstalling && <Spinner /> }
					<span className="block-directory-downloadable-block-list-item__title">
						{ createInterpolateElement(
							sprintf(
								/* translators: %1$s: block title, %2$s: author name. */
								__( '%1$s <span>by %2$s</span>' ),
								decodeEntities( title ),
								author
							),
							{
								span: (
									<span className="block-directory-downloadable-block-list-item__author" />
								),
							}
						) }
					</span>
					<BlockRatings
						rating={ rating }
						ratingCount={ ratingCount }
					/>
				</span>
				<p className="block-directory-downloadable-block-list-item__desc">
					{ decodeEntities( description ) }
				</p>
			</CompositeItem>
		</div>
	);
}

export default DownloadableBlockListItem;
