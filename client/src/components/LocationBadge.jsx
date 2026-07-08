import { LOCATION_CONFIG } from '../utils/formatters';

const LocationBadge = ({ location }) => {
  const config = LOCATION_CONFIG[location] || LOCATION_CONFIG.remote;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

export default LocationBadge;
