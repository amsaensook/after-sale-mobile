import React from 'react';
import { Text, Icon, HStack, Box, Divider } from 'native-base';
import { FontAwesome5  } from '@expo/vector-icons';

const Logo = () => {
  return (
    <>
      <HStack space={2}>
        <Icon color={'blue.200'} as={<FontAwesome5  name="layer-group" />} size="8" />
        <HStack>
          <Text fontSize={20} bold color={'#FFFEFE'}>
            AFTER{` `}
            <Text fontSize={20} fontStyle="italic" bold color="gray.300">
              SALE
            </Text>
          </Text>
          {/*  <HStack alignItems={"center"}>
            <Divider orientation="vertical" mx="2" thickness="2" h={5} />
            <Text fontSize={15} bold color="gray.400">
              SYSTEM
            </Text>
          </HStack> */}
        </HStack>
      </HStack>
    </>
  );
};

export default Logo;
