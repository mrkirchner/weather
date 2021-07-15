import { FunctionComponent, useEffect, useState } from 'react';

const Navigation: FunctionComponent<{ zipcode: string; onChangeLocation: (value: string) => void }> = ({
  zipcode = '',
  onChangeLocation,
}) => {
  const [location, setLocation] = useState<string>(zipcode);

  useEffect(() => {
    setLocation(zipcode);
  }, [zipcode]);

  return (
    <nav className="flex items-center justify-end flex-wrap bg-teal-500 p-2 mb-8">
      <div>
        <input
          className="rounded-l-lg p-3 border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white"
          placeholder="zipcode"
          value={location}
          onChange={(e) => setLocation(e.target.value || '')}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              onChangeLocation(location);
            }
          }}
        />
        <button
          className="px-8 rounded-r-lg bg-yellow-400  text-gray-800 font-bold p-3 uppercase border-yellow-500 border-t border-b border-r"
          onClick={() => onChangeLocation(location)}>
          Change Location
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
