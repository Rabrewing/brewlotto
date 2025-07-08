// @file: components/ui/TeamSelect.jsx
// @summary: Reusable dropdown for assigning developers or teams

import useTeamDirectory from '@/hooks/useTeamDirectory';

export default function TeamSelect({ label = '👤 Delegate', onSelect, value = '' }) {
    const people = useTeamDirectory({ onlyDevs: true });

    return (
        <select
            value={value}
            onChange={(e) => onSelect(e.target.value)}
            className="bg-yellow-900 text-yellow-100 px-2 py-1 rounded text-sm"
        >
            <option value="">{label}</option>
            {people.map((person) => (
                <option key={person.name} value={person.name}>
                    {person.name} — {person.team}
                </option>
            ))}
        </select>
    );
}