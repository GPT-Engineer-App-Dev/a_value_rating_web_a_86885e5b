import React, { useState } from "react";
import { Box, Button, Container, Heading, Input, List, ListItem, Stack, Text, VStack, Progress, OrderedList, Center } from "@chakra-ui/react";
import { FaArrowRight, FaCheck, FaSearch } from "react-icons/fa";

// A mock list of values for the purpose of this example
const VALUES = ["Honesty", "Integrity", "Respect", "Innovation", "Teamwork", "Accountability", "Excellence", "Diversity", "Leadership", "Passion", "Quality", "Efficiency", "Reliability", "Creativity", "Empathy", "Courage", "Community", "Sustainability"];

const Index = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedValues, setSelectedValues] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [matchups, setMatchups] = useState([]);
  const [currentMatchup, setCurrentMatchup] = useState(0);
  const [rankings, setRankings] = useState({});

  const handleSelectValue = (value) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    } else {
      setSelectedValues([...selectedValues, value].slice(0, 10));
    }
  };

  const handleStartRating = () => {
    // Generate the matchups
    let newMatchups = [];
    for (let i = 0; i < selectedValues.length; i++) {
      for (let j = i + 1; j < selectedValues.length; j++) {
        newMatchups.push({ value1: selectedValues[i], value2: selectedValues[j], winner: null });
      }
    }
    setMatchups(newMatchups);
    setRankings(selectedValues.reduce((acc, value) => ({ ...acc, [value]: 0 }), {}));
    setCurrentPage("compare");
  };

  const handleMatchupSelection = (winner) => {
    let newMatchups = [...matchups];
    newMatchups[currentMatchup].winner = winner;
    setMatchups(newMatchups);

    let newRankings = { ...rankings };
    newRankings[winner]++;
    setRankings(newRankings);

    if (currentMatchup < matchups.length - 1) {
      setCurrentMatchup(currentMatchup + 1);
    } else {
      setCurrentPage("results");
    }
  };

  const filteredValues = searchValue ? VALUES.filter((value) => value.toLowerCase().includes(searchValue.toLowerCase())) : VALUES;

  return (
    <Container maxW="container.md" py={10}>
      {currentPage === "home" && (
        <VStack spacing={6} align="stretch">
          <Heading>Welcome to the Value Rating App</Heading>
          <Text>This app will help you select and prioritize your top 10 personal values. Click "Start Rating" to begin the process.</Text>
          <Button colorScheme="blue" rightIcon={<FaArrowRight />} onClick={() => setCurrentPage("select")}>
            Start Rating
          </Button>
        </VStack>
      )}

      {currentPage === "select" && (
        <VStack spacing={6} align="stretch">
          <Heading>Select Your Top 10 Values</Heading>
          <Input placeholder="Search values..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} rightElement={<FaSearch />} />
          <List spacing={3}>
            {filteredValues.map((value) => (
              <ListItem key={value}>
                <Button variant={selectedValues.includes(value) ? "solid" : "outline"} isFullWidth onClick={() => handleSelectValue(value)} leftIcon={selectedValues.includes(value) ? <FaCheck /> : null}>
                  {value}
                </Button>
              </ListItem>
            ))}
          </List>
          <Button colorScheme="green" isDisabled={selectedValues.length < 10} onClick={handleStartRating}>
            Continue to Compare
          </Button>
        </VStack>
      )}

      {currentPage === "compare" && (
        <VStack spacing={6} align="stretch">
          <Heading>Compare Values</Heading>
          <Progress value={((currentMatchup + 1) / matchups.length) * 100} />
          <Stack direction="row" justify="space-around">
            <Button colorScheme="blue" onClick={() => handleMatchupSelection(matchups[currentMatchup].value1)}>
              {matchups[currentMatchup].value1}
            </Button>
            <Text>vs</Text>
            <Button colorScheme="red" onClick={() => handleMatchupSelection(matchups[currentMatchup].value2)}>
              {matchups[currentMatchup].value2}
            </Button>
          </Stack>
        </VStack>
      )}

      {currentPage === "results" && (
        <VStack spacing={6} align="stretch">
          <Heading>Your Value Rankings</Heading>
          <OrderedList>
            {Object.keys(rankings)
              .sort((a, b) => rankings[b] - rankings[a])
              .map((value, index) => (
                <ListItem key={index}>
                  <Stack direction="row" justify="space-between">
                    <Text>
                      {index + 1}. {value}
                    </Text>
                    <Text>{rankings[value]} wins</Text>
                  </Stack>
                </ListItem>
              ))}
          </OrderedList>
          <Center>
            <Button colorScheme="purple" onClick={() => setCurrentPage("home")}>
              Start Over
            </Button>
          </Center>
        </VStack>
      )}
    </Container>
  );
};

export default Index;
