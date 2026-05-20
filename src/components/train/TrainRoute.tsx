interface Station {
  stationCode: string;
  stationName: string;
}

interface Props {
  route?: Station[];
}

export default function TrainRoute({ route }: Props) {
  if (!route || route.length === 0) return null;

  return (
    <div className="rt-route-card">
      <h3>Journey Route</h3>

      <div className="rt-route-list">
        {route.map((station, index) => (
          <div key={index} className="rt-route-item">
            <div className="rt-route-line">
              <div className="rt-route-dot" />

              {index !== route.length - 1 && (
                <div className="rt-route-track" />
              )}
            </div>

            <div>
              <strong>{station.stationCode}</strong>
              <p>{station.stationName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}