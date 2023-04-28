import * as React from "react";
import { Provider, Flex, Text, Button, Header } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import { app,FrameContexts} from "@microsoft/teams-js";
import { Grid, Box, Form, FormInput, FormButton, Card, Checkbox, Pill } from "@fluentui/react-northstar";
import { Provider as RTProvider, themeNames, CommunicationOptions, TListInteraction, TToolbarInteraction } from "@fluentui/react-teams";
import { TeamsTheme } from "@fluentui/react-teams/lib/cjs/themes";
import Axios from "axios";
import { orderBy, sortBy } from "lodash";
import { ComboBox,IComboBox, IComboBoxOption, IComboBoxStyles ,List} from '@fluentui/react';
import { Stack, IStackTokens } from '@fluentui/react';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { DetailsList, DetailsListLayoutMode, IColumn } from '@fluentui/react';

/**
 * Implementation of the EstiMate Tab content page
 */

interface IsEstimate {
    estimate: string;
  }


const options: IComboBoxOption[] = [
  { key: '1', text: '1' },
  { key: '2', text: '2' },
  { key: '3', text: '3' },
  { key: '5', text: '5' },
  { key: '8', text: '8' },
  { key: '13', text: '13' },
  { key: '21', text: '21' },

];

  // Example formatting
const stackTokens: IStackTokens = { childrenGap: 40 };
  




// Optional styling to make the example look nicer
const comboBoxStyles: Partial<IComboBoxStyles> = { root: { maxWidth: 300 } };
export const EstiMateTab = () => {

    const [{ inTeams, theme, themeString, context }] = useTeams();
    const [entityId, setEntityId] = useState<string | undefined>();
    const [accessToken, setAccessToken] = useState<string>();
    const [meetingId, setMeetingId] = useState<string | undefined>();
    const [frameContext, setFrameContext] = useState<FrameContexts | null>();
    const [showAddTopicForm, setShowAddTopicForm] = useState<boolean>(false);
    const [currentUserId, setCurrentUserId] = useState<string>("");
    const [currentUserName, setCurrentUserName] = useState<string>("");
    const [newTopicTitle, setNewTopicTitle] = useState<string>();
    const [estimations, setEstimations] = useState<IsEstimate[]>([]);
    const MyTable = ({ estimations }: { estimations: IsEstimate[] }) => {
        // Group the estimations by the estimate value
        const groupedEstimations = estimations.reduce((groups: { [estimate: string]: IsEstimate[] }, item) => {
          const estimate = item.estimate;
          if (!groups[estimate]) {
            groups[estimate] = [];
          }
          groups[estimate].push(item);
          return groups;
        }, {});
      
        // Sort the groups by estimate value
        const sortedGroups = Object.entries(groupedEstimations).sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
      
        // Define the columns for the table
        const columns: IColumn[] = [
          { key: 'estimate', name: 'Estimate', fieldName: 'estimate', minWidth: 100 },
          { key: 'count', name: 'Occurrences', minWidth: 50, onRender: renderCount },
        ];
      
        // Define the items for the table, grouped and sorted
        const items: IsEstimate[] = sortedGroups.flatMap(([estimate, items]) =>
          items.map((item) => ({ ...item, estimate }))
        );
      
        // Function to render the count column
        function renderCount(item: IsEstimate): JSX.Element {
          return <div>{groupedEstimations[item.estimate].length}</div>;
        }
      
        return (
          <DetailsList
            items={items}
            columns={columns}
            layoutMode={DetailsListLayoutMode.justified}
            selectionPreservedOnEmptyClick={true}
            styles={{ root: { color: 'black' } }}
          />
        );
      };

    const ShowButton = () => {  
        const [showList, setShowList] = useState(true);
      
        const toggleList = () => {
          setShowList(!showList);
        };
      
        return (
          <div>
            <PrimaryButton onClick={toggleList}>
              {showList ? 'Hide List' : 'Show List'}
            </PrimaryButton>
            {showList && (
             <MyTable estimations={estimations} />
            )}
          </div>
        );
    }
    const MyForm = () => {  
        const [selectedValue, setSelectedValue] = useState<string>("1");
      
        const handleChange = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption): void => {
          if (option) {
            setSelectedValue(option.key.toString());
          }
        };
      
        const handleSubmit = (): void => {
          alert(`Selected value: ${selectedValue}`);
          // create a copy of the existing array using the spread operator
          const updatedEstimations = [...estimations];
          const newEstimate = { estimate: selectedValue };
  
            // add the new element to the copied array
            updatedEstimations.push(newEstimate);
            // update the state with the copied array
            setEstimations(updatedEstimations);
        };
      
        return (
          <div>
            <ComboBox
              defaultSelectedKey="1"
              options={options}
              styles={comboBoxStyles}
              calloutProps={{ doNotLayer: true }}
              onChange={handleChange}
            />
            <div style={{ height: '1em' }} />
            <Stack horizontal tokens={stackTokens}>
              <PrimaryButton text="Submit" onClick={handleSubmit} allowDisabledFocus disabled={false} checked={false} />
            </Stack>
          </div>
        );
      };

    useEffect(() => {
        if (inTeams === true) {
            app.notifySuccess();
        } else {
            setEntityId("Not in Microsoft Teams");
        }
    }, [inTeams]);

    useEffect(() => {
        if (context) {
            setEntityId(context.page.id);
            setFrameContext(app.getFrameContext());
        }
    }, [context]);
    
    const getSidePanelUX = () => {
        return (
            <Flex fill={true} column styles={{ gap: "10px", color: "white" }}>
              <Text content="Select your Estimation of that ticket" />
                 <MyForm/>
                 <div style={{ height: '1em' }} />
                
                 <div style={{ height: '1em' }} />
                 <ShowButton/>
            </Flex>
          )
      }
            let mainContentElement: JSX.Element | JSX.Element[] | null = null;
            switch (frameContext) {
              case FrameContexts.sidePanel:
                mainContentElement = getSidePanelUX();
                break;
              default:
                mainContentElement = getSidePanelUX();
            }
            
            return (
                <Provider >
                        {mainContentElement}
                </Provider>
            );
};
