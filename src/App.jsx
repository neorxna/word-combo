import { useEffect, useState } from 'react'
import {
  createTheme,
  MantineProvider,
  Button,
  Stack,
  Chip,
  Group
} from '@mantine/core'
import './App.css'

const theme = createTheme()

function CombinationArea () {}

function Game () {
  const candidates = [
    'cone', // 0
    'down', //1
    'off', // 2
    'parsley', //3
    'wages', // 4
    'rosemary', // 5
    '_______, ____, ________ and...', // 6
    'anagram of ____', // 7
    'antonym of ____', // 8
    'antonym of ____', // 9
    // 'combine __ and __', // 10
    'homophone of ____', // 11
    'rhymes with ____', // 12
    'anagram of ____' // 13
  ]

  const game = {
    name: '...and they lived happily ever after',
    ghost: '____ ____ a ____',
    target: ['once', 'upon', 'time'],
    candidates: Object.fromEntries(
      candidates.map((c, i) => [`${i}`, { label: c, id: `${i}` }])
    ),
    combinations: [
      [['0', '7'], 'once'],
      [['0', '12'], 'once'],
      [['1', '8'], 'up'],
      [['1', '9'], 'up'],
      [['2', '8'], 'on'],
      [['2', '9'], 'on'],
      [['1+8', '2+9'], 'upon'],
      [['1+9', '2+8'], 'upon'],
      [['4', '11'], 'ages'],
      [['4+11', '7'], 'sage'],
      [['4+11', '12'], 'sage'],
      [['4+11+12', '3', '5', '6'], 'thyme'],
      [['4+11+7', '3', '5', '6'], 'thyme'],
      [['4+11+12+3+5+6', '10'], 'time'],
      [['4+11+7+3+5+6', '10'], 'time']
    ]
  }

  const [createdCombinations, setCreatedCombinations] = useState(
    candidates.map((c, i) => ({ label: c, id: `${i}`, isTarget: false }))
  )

  const [selectedCandidates, setSelectedCandidates] = useState([])
  const [log, setLog] = useState([])

  const solved = game.target.every(t =>
    createdCombinations.find(({ label }) => label === t)
  )

  useEffect(() => {
    if (solved) {
      setLog(log => [...log, '🎉'])
    }
  }, [createdCombinations])

  function evaluateCombination () {
    const validCombo = game.combinations.find(([combination, result]) =>
      combination.every(id => selectedCandidates.includes(id))
    )
    if (validCombo) {
      const [combination, result] = validCombo
      setCreatedCombinations(current => [
        ...current.filter(({ id }) => !combination.includes(id)),
        {
          label: result,
          id: combination.join('+'),
          isTarget: game.target.find(t => t === result),
          fresh: true
        }
      ])
      setLog(log => [...log, '😍'])
    } else {
      setLog(log => [...log, '😔'])
    }
    setSelectedCandidates([])
  }

  const targs = createdCombinations
    .filter(({ isTarget }) => isTarget)
    .map(({ label }) => label)

  return (
    <div id='game'>
      <Stack>
        <h4>{game.name}</h4>
        <h2>
          {targs.includes('once') ? 'Once' : '____'}{' '}
          {targs.includes('upon') ? 'upon' : '____'} a{' '}
          {targs.includes('time') ? 'time' : '____'}
        </h2>
        <Chip.Group
          multiple={true}
          value={selectedCandidates}
          onChange={setSelectedCandidates}
        >
          <Group>
            {createdCombinations
              .filter(({ isTarget }) => !isTarget)
              .map(({ label, id, fresh }) => (
                <Chip
                  value={`${id}`}
                  key={`${id}`}
                  variant={fresh ? 'filled' : 'outline'}
                  size='md'
                >
                  {label}
                </Chip>
              ))}
          </Group>
        </Chip.Group>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {!solved && (
            <Button onClick={() => evaluateCombination()}>combine</Button>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {log.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div style={{ fontFamily: 'monospace', fontSize: '0.5rem' }}>
            a milquetoast game
          </div>
        </div>
      </Stack>
    </div>
  )
}

function App () {
  return (
    <MantineProvider theme={theme}>
      <div className='App'>
        <Game />
      </div>
    </MantineProvider>
  )
}

export default App
