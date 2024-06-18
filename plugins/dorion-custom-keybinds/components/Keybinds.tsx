import { css, classes } from './Keybinds.tsx.scss'
import { KeybindSection } from './KeybindSection'

const {
  ui: {
    Button,
    Switch,
    Text,
    HeaderTags,
    Header,
    injectCss
  },
  solid: {
    createSignal
  }
} = shelter

let injectedCss = false

interface Props {
  keybindActionTypes: KeybindActionType[]
  keybindDescriptions: KeybindDescription[]
}

export function Keybinds(props: Props) {
  if (!injectedCss) {
    injectedCss = true
    injectCss(css)
  }

  // list of keybinds that are set (aka keybinds that have a section already)
  const [keybindSections, setKeybindSections] = createSignal<Keybind>([])

  return (
    <div class={classes.keybindSection}>
      <Header tag={HeaderTags.H1} class={classes.header}>
        Keybinds
      </Header>

      <div class={classes.keybindsHeader}>
        <div class={classes.keybindsBanner}>
          <Text>
            Global keybinds are an experimental feature!
          </Text>  
        </div>

        <Button
          class={classes.keybindsButton}
          grow={true}
          onClick={() => {
            // Ensure keybinds list max is the same as the keybindActionTypes list
            if (keybindSections().length >= props.keybindActionTypes.length) {
              return
            }

            setKeybindSections([...keybindSections(), {
              key: 'UNASSIGNED',
              action: '',
              keys: []
            }])
          }}
        >
          Add Keybind
        </Button>
      </div>

      {
        keybindSections().map((section: Keybind, idx) => (
          <KeybindSection
            key={idx}
            keybindActionTypes={
              // Filter out keybinds that are already set. Always allow UNASSIGNED
              props.keybindActionTypes.filter((type) => {
                if (section.key === 'UNASSIGNED') return true
                return !keybindSections().some((keybind) => keybind.key === type.value)
              })
            }
            keybindDescriptions={props.keybindDescriptions}
            keybind={section}
            onKeybindChange={(keybind) => {
              // TODO last keybind persists when adding a new keybind
              // so i need to filter it out somehow
              const newKeybinds = keybindSections().filter(bind => bind.key !== keybind.key)
              newKeybinds.push(keybind)

              setKeybindSections(newKeybinds)
            }}
          />
        ))
      }
    </div>
  )
}
