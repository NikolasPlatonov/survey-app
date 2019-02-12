import React from 'react';

export default function SurveysForm(props) {
  return (
    <table>
      <thead />
      <tbody>
        {props.events.map(row => (
          <tr>
            <td>{row.title}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
