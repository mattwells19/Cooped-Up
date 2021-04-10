import React from "react";
import { Box, Center, CloseButton, Text, useToast, useToken } from "@chakra-ui/react";
import { AxeIcon, ChallengeIcon, CoinIcon } from "@icons";
import { Actions, Influence } from "@contexts/GameStateContext/types";
import { InfluenceDetails } from "@utils/InfluenceUtils";

export type IActionToastProps =
 | { variant: Actions.Coup, performerName: string, victimName: string, lostInfluence: Influence }
 | { variant: Actions.Income, performerName: string, victimName?: never, lostInfluence?: never }
 | { variant: Actions.Tax, performerName: string, victimName?: never, lostInfluence?: never }
 | { variant: "Challenge", performerName?: never, victimName: string, lostInfluence: Influence }

const ActionToast: React.FC<IActionToastProps> = ({ performerName, variant, victimName, lostInfluence }) => {
	const { closeAll: closeAllToasts } = useToast();
	return (
		<Box
			bg="gray.600"
			maxW="sm"
			padding={5}
			rounded="md"
			boxShadow="2xl"
			role="alert"
			position="relative"
			overflow="hidden"
		>
			<CloseButton marginLeft="auto" onClick={() => closeAllToasts()} />
			<Center>
				{variant === Actions.Income && <CoinIcon width={useToken("sizes", "40")} />}
				{/* TODO: Needs Graphic */}
				{variant === Actions.Coup && <AxeIcon width={useToken("sizes", "40")} />}
				{/* TODO: Needs Graphic */}
				{variant === Actions.Tax && <CoinIcon width={useToken("sizes", "40")} />}
				{variant === "Challenge" && <ChallengeIcon width={useToken("sizes", "40")} />}
			</Center>
			<Box fontSize="large">
				{variant === Actions.Income && (
					<Text>
						<Text as="span" fontWeight="bold">{performerName}</Text>
            &nbsp;took income which is only performed by mere peasants.
					</Text>
				)}
				{variant === Actions.Tax && (
					<Text>
						<Text as="span" fontWeight="bold">{performerName}</Text>
            &nbsp;must have royalty in their blood as they have collected tax from the peasants.
					</Text>
				)}
				{variant === Actions.Coup && (
					<>
						<Text>
							<Text as="span" fontWeight="bold">{performerName}</Text>
              &nbsp;coup&apos;d&nbsp;
							<Text as="span" fontWeight="bold">
								{victimName}
							</Text>
            !
						</Text>
						<Text marginTop="3">
							<Text as="span" fontWeight="bold">{victimName}</Text>
              &nbsp;lost their&nbsp;
							{/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
							<Text as="span" fontWeight="bold" color={InfluenceDetails[lostInfluence!].color}>{lostInfluence}</Text>
            .
						</Text>
					</>
				)}
				{variant === "Challenge" && (
					<Text marginTop="3">
						<Text as="span" fontWeight="bold">{victimName}</Text>
            &nbsp;lost their&nbsp;
						{/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
						<Text as="span" fontWeight="bold" color={InfluenceDetails[lostInfluence!].color}>{lostInfluence}</Text>
          .
					</Text>
				)}
			</Box>
		</Box>
	);
};

const useActionToast = (): (props: IActionToastProps) => string | number | undefined => {
	const toast = useToast();
	return (props: IActionToastProps) => toast({
		position: "top",
		duration: 5000,
		render: (): React.ReactNode => <ActionToast {...props} />,
	});
};

export default useActionToast;
