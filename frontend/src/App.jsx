import React from 'react';
import Routers from './Route';
import SearchResultProvider from './_helper/SearchResult/SearchResult';
import AnimationThemeProvider from './_helper/AnimationTheme/AnimationThemeProvider';
import CustomizerProvider from './_helper/Customizer/CustomizerProvider';
import {RequestsProvider} from "./_helper/Requests/RequestsProvider";
import {ModelsProvider} from "./_helper/Models/ModelsProvider";
import {ConditionsProvider} from "./_helper/Conditions/ConditionsProvider";
import {ShipsProvider} from "./_helper/Ships/ShipsProvider";
import {SailingSectionsProvider} from "./_helper/SailingSections/SailingSectionsProvider";
import {InitPlacementsProvider} from "./_helper/InitPlacements/InitPlacementsProvider";

const App = () => (
  <div className='App'>
    <CustomizerProvider>
      <SearchResultProvider>
        <RequestsProvider>
          <ModelsProvider>
            <ConditionsProvider>
              <ShipsProvider>
                <SailingSectionsProvider>
                  <InitPlacementsProvider>
                    <AnimationThemeProvider>
                      <Routers />
                    </AnimationThemeProvider>
                  </InitPlacementsProvider>
                </SailingSectionsProvider>
              </ShipsProvider>
            </ConditionsProvider>
          </ModelsProvider>
        </RequestsProvider>
      </SearchResultProvider>
    </CustomizerProvider>
  </div>
);

export default App;
