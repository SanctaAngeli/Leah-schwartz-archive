import { Link } from 'react-router-dom';
import type { TreeNode } from '../../data/siteTree';

// A card for one page in the archive tree: image, plain title, short count.

interface Props {
  node: TreeNode;
  large?: boolean;
}

function NodeCard({ node, large }: Props): JSX.Element {
  return (
    <Link
      to={node.path}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B7355]/50 rounded-2xl"
    >
      <div className={`overflow-hidden rounded-2xl bg-white/60 shadow-soft group-hover:shadow-glass transition-shadow duration-500 ${large ? 'aspect-[4/3]' : 'aspect-[3/2]'}`}>
        {node.image && (
          <img
            src={node.image}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        )}
      </div>
      <span className={`block mt-3 font-heading text-text-primary leading-snug ${large ? 'text-2xl' : 'text-xl'}`}>
        {node.title}
      </span>
      {node.note && <span className="block font-body text-sm text-text-muted">{node.note}</span>}
    </Link>
  );
}

export default NodeCard;
