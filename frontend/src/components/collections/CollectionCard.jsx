import { Link } from 'react-router-dom';
import { Card } from '../ui';


function CollectionCard({ title, description, image, slug }) {
   return (
    <Link
      to={`/shop?collection=${slug}`}
      className="group block"
    >
      <Card className="border-0 bg-transparent">
        <div className="aspect-4/5 overflow-hidden bg-neutral-100">
          {image && (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-medium">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm leading-6 text-neutral-500">
              {description}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}

export default CollectionCard;