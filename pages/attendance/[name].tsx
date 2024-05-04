import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const StudentDetailsPage = () => {
  const router = useRouter();
  const { name } = router.query;
  const rrn = name;

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/fetchattendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rrn,
          }),
        });

        const responseData = await res.json();
        const filteredData = responseData
          .filter((entry: any) => entry.rrn === rrn)
          .map((entry: any) => {
            const { _id, updatedAt, createdAt, ...rest } = entry;
            return { ...rest, createdAt: new Date(createdAt).toLocaleDateString() };
          });
        setData(filteredData);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [rrn]);

  if (data.length === 0) {
    return <div>Please Wait While the data is loading...</div>;
  }

  return (
    <div>
      <h1 style={{ color: '#89CFF0' }}>Hello Attendance Dashboard of {name}</h1>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              {Object.keys(data[0]).map((key) => (
                <th key={key} style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'left' }}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((entry: any, index: number) => (
              <tr key={index}>
                {Object.values(entry).map((value: any, index: number) => (
                  <td key={index} style={{ border: '1px solid #dddddd', padding: '8px' }}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default StudentDetailsPage;
